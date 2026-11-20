// src/components/checkout/CheckoutSummary.jsx
import { useCart } from "../../context/CartContext";
import { useCheckoutTotals } from "../../hook/useCheckoutTotals";

const formatARS = (value) =>
  Number(value || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

const CheckoutSummary = () => {
  const { items } = useCart();
  const { subtotal, descuento, totalFinal, hasDescuento } = useCheckoutTotals();

  return (
    <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 space-y-3">
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
        Tu pedido
      </h2>

      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => {
          const qty = Number(item.quantity ?? 0);
          const price = Number(item.precio ?? 0);
          return (
            <li key={item.id} className="flex items-center gap-3">
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                {item.foto_url && (
                  <img src={item.foto_url} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <span className="flex-1 min-w-0 truncate">
                {item.nombre}{" "}
                <span className="text-gray-500 dark:text-gray-400">x{qty}</span>
              </span>
              <span className="tabular-nums">{formatARS(price * qty)}</span>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-3 space-y-1 text-sm">
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatARS(subtotal)}</span>
        </div>

        {hasDescuento && (
          <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
            <span>Descuento</span>
            <span className="tabular-nums">-{formatARS(descuento)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-900 dark:text-gray-100 font-semibold text-base pt-1">
          <span>Total</span>
          <span className="tabular-nums">{formatARS(totalFinal)}</span>
        </div>
      </div>
    </section>
  );
};

export default CheckoutSummary;