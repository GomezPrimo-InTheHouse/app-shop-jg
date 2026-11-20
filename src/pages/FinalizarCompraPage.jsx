// src/pages/FinalizarCompraPage.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCoupon } from "../context/CouponContext";
import { useNotification } from "../context/NotificationContext";
import { useUI } from "../context/UIContext";
import { useCheckoutTotals } from "../hook/useCheckoutTotals";
import CouponInput from "../components/checkout/CouponInput";
import CheckoutSummary from "../components/checkout/CheckoutSummary";
import { crearVentaApi } from "../api/shopApi";
import ShopHeader from "../components/layout/ShopHeader";

const formatARS = (value) =>
  Number(value || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

const cardClass =
  "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4";

const FinalizarCompraPage = () => {
  const { cliente, invalidateCuponActivo } = useAuth();
  const { items, itemsForBackend, clearCart } = useCart();
  const { cupon, limpiarCupon } = useCoupon();
  const { subtotal, descuento, totalFinal } = useCheckoutTotals();
  const { showNotification } = useNotification();
  const { openLoginModal, isLoginModalOpen } = useUI();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // Si el cliente tocó "Confirmar" sin estar identificado, recordamos la
  // intención y confirmamos solos apenas complete sus datos (antes había que
  // volver a tocar el botón y muchos creían que ya habían comprado).
  const pendingConfirmRef = useRef(false);

  const isEmpty = items.length === 0;

  const handleConfirmarCompra = useCallback(async () => {
    if (loading) return;

    if (isEmpty) {
      showNotification("warning", "Tu carrito está vacío.");
      return;
    }

    if (!cliente?.id) {
      pendingConfirmRef.current = true;
      openLoginModal();
      return;
    }

    pendingConfirmRef.current = false;
    setLoading(true);

    const payload = {
      cliente_id: cliente.id,
      items: itemsForBackend,
      monto_abonado: 0,
      estado_nombre: "PENDIENTE_PAGO",
      ...(cupon?.codigo ? { codigo_cupon: cupon.codigo } : {}),
    };

    try {
      const resp = await crearVentaApi(payload);
      const data = resp?.data ?? resp;

      // Si el backend no devuelve el detalle, lo armamos desde el CARRITO
      // (antes se armaba desde itemsForBackend, que no tiene nombre ni precio,
      // y la confirmación/WhatsApp/Mercado Pago recibían NaN y "Producto").
      const detallesBackend = data?.detalles || data?.items;
      const detalles =
        Array.isArray(detallesBackend) && detallesBackend.length > 0
          ? detallesBackend
          : items.map((item) => ({
              producto_id: item.id,
              producto_nombre: item.nombre,
              cantidad: item.quantity,
              precio_unitario: Number(item.precio) || 0,
              subtotal: (Number(item.precio) || 0) * item.quantity,
              foto_url: item.foto_url,
            }));

      const ventaBase = data?.venta || data || {};
      const clienteVenta = ventaBase?.cliente || data?.cliente || {
        nombre: cliente.nombre,
        apellido: cliente.apellido,
      };

      // Datos para la pantalla de confirmación. Van por navigation state (no
      // se guardan en localStorage: ahí quedaban DNI y email sin vencimiento).
      // Si el cliente recarga, la confirmación se vuelve a pedir al backend
      // con el venta_id de la URL.
      const confirmacion = {
        ...data,
        venta: { ...ventaBase, cliente: clienteVenta },
        detalles,
        total_bruto: data?.total_bruto ?? subtotal,
        descuento: data?.descuento ?? descuento,
        total_final: data?.total_final ?? totalFinal,
      };

      if (payload.codigo_cupon) {
        const usado = Number(confirmacion.descuento) > 0;
        invalidateCuponActivo?.({
          markBlocked: usado,
          reason: usado ? "Cupón utilizado con éxito." : "Cupón no aplicable.",
        });
      }

      clearCart();
      limpiarCupon?.();

      showNotification("success", "¡Pedido registrado! Elegí cómo pagar.");

      const ventaId = ventaBase?.id ?? data?.venta_id ?? data?.id;
      const qs = ventaId ? `?venta_id=${ventaId}` : "";
      navigate(`/shop/confirmacion${qs}`, { state: confirmacion });
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      const backendMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "No pudimos registrar tu pedido. Probá de nuevo en unos segundos.";
      showNotification("error", backendMsg);
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    isEmpty,
    cliente,
    items,
    itemsForBackend,
    cupon,
    subtotal,
    descuento,
    totalFinal,
    openLoginModal,
    showNotification,
    invalidateCuponActivo,
    clearCart,
    limpiarCupon,
    navigate,
  ]);

  // ▶️ Continuar la compra automáticamente después de identificarse
  useEffect(() => {
    if (cliente?.id && pendingConfirmRef.current) {
      handleConfirmarCompra();
    }
  }, [cliente?.id, handleConfirmarCompra]);

  // Si cerró el modal sin completar datos, olvidamos la intención
  useEffect(() => {
    if (!isLoginModalOpen && !cliente?.id) pendingConfirmRef.current = false;
  }, [isLoginModalOpen, cliente?.id]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <ShopHeader />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-4">Finalizar compra</h1>

          {isEmpty ? (
            // 🛒 Estado vacío: antes la página parecía lista para confirmar
            <div className={`${cardClass} flex flex-col items-center gap-3 py-12 text-center`}>
              <ShoppingCart className="h-10 w-10 text-gray-400" aria-hidden="true" />
              <p className="text-base font-medium">Tu carrito está vacío</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Agregá productos desde la tienda para finalizar tu compra.
              </p>
              <Link
                to="/"
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-indigo-700 hover:bg-indigo-800
                           px-5 py-3 text-sm font-semibold text-white transition-colors
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
              >
                Ir a la tienda
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[2fr,1.3fr]">
              {/* En mobile el resumen va PRIMERO: el cliente ve qué compra antes de confirmar */}
              <div className="lg:order-2">
                <CheckoutSummary />
              </div>

              <div className="space-y-4 lg:order-1">
                {/* Datos del cliente */}
                <section className={cardClass}>
                  <h2 className="text-base font-semibold mb-3">Tus datos</h2>
                  {cliente ? (
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p>
                        {cliente.nombre} {cliente.apellido}
                      </p>
                      {cliente.dni && <p>DNI: {cliente.dni}</p>}
                      {cliente.email && <p>Email: {cliente.email}</p>}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Necesitamos tu nombre y WhatsApp para coordinar la entrega.
                      </p>
                      <button
                        type="button"
                        onClick={openLoginModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-600
                                   px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50
                                   dark:text-indigo-300 dark:border-indigo-400 dark:hover:bg-indigo-950
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                      >
                        <UserRound className="h-4 w-4" aria-hidden="true" />
                        Completar mis datos
                      </button>
                    </div>
                  )}
                </section>

                <CouponInput />

                <section className={`${cardClass} text-sm text-gray-700 dark:text-gray-300`}>
                  <p className="flex items-baseline justify-between">
                    <span className="font-semibold">Total a pagar</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                      {formatARS(totalFinal)}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    En el próximo paso elegís cómo pagar: transferencia o Mercado Pago.
                  </p>
                </section>

                <button
                  type="button"
                  onClick={handleConfirmarCompra}
                  disabled={loading}
                  aria-busy={loading}
                  className="w-full min-h-[48px] inline-flex items-center justify-center rounded-xl
                             bg-emerald-700 hover:bg-emerald-800
                             disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
                             px-5 py-3 text-base font-semibold text-white transition-colors
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2
                             dark:focus-visible:ring-offset-gray-900"
                >
                  {loading
                    ? "Registrando tu pedido..."
                    : cliente
                    ? "Confirmar pedido"
                    : "Continuar"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FinalizarCompraPage;