// src/pages/FinalizarCompraPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCoupon } from "../context/CouponContext";
import { useNotification } from "../context/NotificationContext";
import { useUI } from "../context/UIContext";
import CouponInput from "../components/checkout/CouponInput";
import CheckoutSummary from "../components/checkout/CheckoutSummary";
import { crearVentaApi } from "../api/shopApi";
import ShopHeader from "../components/layout/ShopHeader";

const LS_LAST_ORDER = "jg_shop_last_order"; // ✅ FIX: estaba faltando

const FinalizarCompraPage = () => {
  const { cliente, invalidateCuponActivo } = useAuth();
  const { itemsForBackend, totalAmount, clearCart } = useCart();
  const { cupon, totalConDescuento, limpiarCupon } = useCoupon();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const { openLoginModal } = useUI();

  const [montoAbonado] = useState(0);
  const [loading, setLoading] = useState(false);

 const LS_LAST_ORDER = "jg_shop_last_order";

const handleConfirmarCompra = async () => {
  if (!cliente?.id) {
    showNotification("info", "Para finalizar la compra, primero completá tus datos.");
    openLoginModal();
    return;
  }

  if (!itemsForBackend || itemsForBackend.length === 0) {
    showNotification("warning", "Tu carrito está vacío.");
    return;
  }

  setLoading(true);

  // 1. Preparar el envío al servidor
  const payload = {
    cliente_id: cliente.id,
    items: itemsForBackend, // Normalmente [{id, cantidad}, ...]
    monto_abonado: montoAbonado,
    estado_nombre: "PENDIENTE_PAGO",
    ...(cupon?.codigo ? { codigo_cupon: cupon.codigo } : {}),
  };

  try {
    const resp = await crearVentaApi(payload);
    const data = resp?.data ?? resp;

    /**
     * 🔥 PASO CRÍTICO: ENRIQUECIMIENTO DE DATOS
     * Si el backend devuelve la venta pero sin los detalles de productos o cliente,
     * los inyectamos aquí usando la información que YA tenemos en el frontend.
     */
    const enrichedData = {
      ...data,
      // Aseguramos que 'venta' contenga los datos del cliente para la UI/WhatsApp
      venta: {
        ...(data?.venta || data),
        cliente: data?.venta?.cliente || data?.cliente || cliente 
      },
      // Aseguramos que 'detalles' contenga nombres e imágenes de productos
      detalles: (data?.detalles || data?.items) ? (data?.detalles || data?.items) : itemsForBackend.map(item => ({
        producto_id: item.id,
        producto_nombre: item.nombre || item.producto_nombre || item.titulo,
        cantidad: item.cantidad,
        subtotal: (item.precio_oferta || item.precio) * item.cantidad,
        imagen_url: item.imagen_url || item.imagen
      })),
      total_bruto: data?.total_bruto || totalAmount,
      descuento: data?.descuento || (totalAmount - (totalConDescuento || totalAmount)),
      total_final: data?.total_final || totalConDescuento || totalAmount
    };

    // ✅ Guardar en LocalStorage para persistencia ante recargas
    const saved = { ...enrichedData, saved_at: Date.now() };
    try {
      localStorage.setItem(LS_LAST_ORDER, JSON.stringify(saved));
    } catch (lsError) {
      console.warn("No se pudo guardar en LS", lsError);
    }

    // ✅ Gestión de cupones
    if (payload.codigo_cupon) {
      invalidateCuponActivo?.({
        markBlocked: Number(enrichedData.descuento) > 0,
        reason: Number(enrichedData.descuento) > 0
          ? "Cupón utilizado con éxito."
          : "Cupón no aplicable.",
      });
    }

    // ✅ Limpieza de estados globales (Orden importante: primero limpiar, luego navegar)
    clearCart();
    limpiarCupon?.();

    showNotification("success", "¡Pedido realizado! Coordiná el pago por WhatsApp.");

    // ✅ Navegación con QueryString (seguridad) y State (datos completos)
    const ventaId = data?.venta?.id ?? data?.venta_id ?? data?.id;
    const qs = ventaId ? `?venta_id=${ventaId}` : "";

    navigate(`/shop/confirmacion${qs}`, { state: saved });

  } catch (error) {
    console.error("Error al procesar la compra:", error);
    const backendMsg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Ocurrió un error al registrar tu pedido. Por favor intentá nuevamente.";
    
    showNotification("error", backendMsg);
  } finally {
    setLoading(false);
  }
};


  const totalMostrado = totalConDescuento ?? totalAmount ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <ShopHeader />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-4">Finalizar compra</h1>

          <div className="grid lg:grid-cols-[2fr,1.3fr] gap-6">
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm p-4">
                <h2 className="text-sm font-semibold mb-3">Datos del cliente</h2>
                {cliente ? (
                  <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                    <p>{cliente.nombre} {cliente.apellido}</p>
                    <p>DNI: {cliente.dni}</p>
                    {cliente.email && <p>Email: {cliente.email}</p>}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">No hay cliente logueado.</p>
                )}
              </div>

              <CouponInput />

              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm p-4 text-sm text-gray-700 dark:text-gray-300">
                <p className="mb-1">
                  <span className="font-semibold">Monto a pagar:</span>{" "}
                  ${Number(totalMostrado).toLocaleString("es-AR")}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Método de pago se coordina después (transferencia/efectivo/etc).
                </p>
              </div>

              <button
                type="button"
                onClick={handleConfirmarCompra}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500
                           disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
                           px-5 py-2.5 text-sm font-medium text-white transition-colors"
              >
                {loading ? "Procesando..." : "Confirmar compra"}
              </button>
            </div>

            <CheckoutSummary />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinalizarCompraPage;
