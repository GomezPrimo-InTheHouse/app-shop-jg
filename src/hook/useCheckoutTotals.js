// src/hook/useCheckoutTotals.js
// Única fuente de verdad para los totales del checkout.
// Antes FinalizarCompraPage y CheckoutSummary calculaban el total con reglas
// distintas y podían mostrar montos diferentes en la misma pantalla.
import { useCart } from "../context/CartContext.jsx";
import { useCoupon } from "../context/CouponContext.jsx";

export const useCheckoutTotals = () => {
  const { totalAmount } = useCart();
  const { hasCuponAplicado, totalConDescuento, descuentoMonto } = useCoupon();

  const subtotal = Number(totalAmount ?? 0);
  const cuponValido = hasCuponAplicado && Number.isFinite(Number(totalConDescuento));
  const totalFinal = cuponValido ? Number(totalConDescuento) : subtotal;
  const descuento = cuponValido ? Math.max(0, Number(descuentoMonto) || subtotal - totalFinal) : 0;

  return { subtotal, descuento, totalFinal, hasDescuento: descuento > 0 };
};