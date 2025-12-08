// src/pages/FinalizarCompraPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCoupon } from "../context/CouponContext";
import { useNotification } from "../context/NotificationContext";
import CouponInput from "../components/checkout/CouponInput";
import CheckoutSummary from "../components/checkout/CheckoutSummary";
import { crearVentaApi } from "../api/shopApi";
import ShopHeader from "../components/layout/ShopHeader";

const FinalizarCompraPage = () => {
  const { cliente } = useAuth();
  // 🔧 usamos totalAmount en lugar de totalBruto
  const { itemsForBackend, totalAmount, clearCart } = useCart();
  const { cupon, totalConDescuento } = useCoupon();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [montoAbonado] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleConfirmarCompra = async () => {
    if (!cliente) {
      showNotification("warning", "Tenés que iniciar sesión para finalizar la compra.");
      return;
    }
    if (itemsForBackend.length === 0) {
      showNotification("warning", "Tu carrito está vacío.");
      return;
    }

    setLoading(true);
    try {
      const resp = await crearVentaApi({
        cliente_id: cliente.id,
        items: itemsForBackend,
        monto_abonado: montoAbonado,
        estado_nombre: "PENDIENTE_PAGO",
        codigo_cupon: cupon?.codigo || null,
      });

      clearCart();
      showNotification("success", "Compra registrada correctamente.");

      navigate("/shop/confirmacion", {
        state: {
          venta: resp.venta,
          detalles: resp.detalles,
          total_bruto: resp.total_bruto,
          descuento: resp.descuento,
          total_final: resp.total_final,
        },
      });
    } catch (error) {
      console.error(error);
      showNotification("error", "No se pudo registrar la compra.");
    } finally {
      setLoading(false);
    }
  };

  // 🔧 fallback seguro: si no hay cupón ni total, usamos 0
  const totalMostrado = totalConDescuento ?? totalAmount ?? 0;

  return (
    <div
      className="min-h-screen flex flex-col
                 bg-gray-100 dark:bg-gray-900
                 text-gray-900 dark:text-gray-100
                 transition-colors duration-500"
    >
      <ShopHeader />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-4">
            Finalizar compra
          </h1>

          <div className="grid lg:grid-cols-[2fr,1.3fr] gap-6">
            <div className="space-y-4">
              <div
                className="rounded-xl border border-gray-200 dark:border-gray-800
                           bg-white/70 dark:bg-gray-950/70
                           backdrop-blur-sm p-4"
              >
                <h2 className="text-sm font-semibold mb-3">
                  Datos del cliente
                </h2>
                {cliente ? (
                  <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                    <p>
                      {cliente.nombre} {cliente.apellido}
                    </p>
                    <p>DNI: {cliente.dni}</p>
                    {cliente.email && <p>Email: {cliente.email}</p>}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No hay cliente logueado.
                  </p>
                )}
              </div>

              <CouponInput />

              <div
                className="rounded-xl border border-gray-200 dark:border-gray-800
                           bg-white/70 dark:bg-gray-950/70
                           backdrop-blur-sm p-4 text-sm text-gray-700 dark:text-gray-300"
              >
                <p className="mb-1">
                  <span className="font-semibold">Monto a pagar:</span>{" "}
                  ${totalMostrado.toLocaleString("es-AR")}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Método de pago se coordina después (ej: transferencia,
                  efectivo, etc).
                </p>
              </div>

              <button
                type="button"
                onClick={handleConfirmarCompra}
                disabled={loading}
                className="inline-flex items-center justify-center
                           rounded-xl bg-emerald-600 hover:bg-emerald-500
                           disabled:bg-gray-400 dark:disabled:bg-gray-700
                           disabled:cursor-not-allowed
                           px-5 py-2.5 text-sm font-medium text-white
                           transition-colors"
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
