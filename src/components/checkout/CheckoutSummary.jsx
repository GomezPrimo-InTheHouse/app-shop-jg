// // src/components/checkout/CheckoutSummary.jsx
// import { useCart } from "../../context/CartContext";
// import { useCoupon } from "../../context/CouponContext";

// const CheckoutSummary = () => {
//   const { items, totalAmount } = useCart();
//   const { descuentoMonto, totalConDescuento } = useCoupon();

//   const subtotal = totalAmount ?? 0;
//   const totalFinal = totalConDescuento ?? subtotal;

//   return (
//     <div
//       className="rounded-xl border border-gray-200 dark:border-gray-800
//                  bg-white/70 dark:bg-gray-950/70
//                  backdrop-blur-sm p-4 space-y-3"
//     >
//       <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//         Resumen de compra
//       </h3>

//       <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300 max-h-40 overflow-y-auto pr-1">
//         {items.map((item) => (
//           <li
//             key={item.id}
//             className="flex justify-between gap-2"
//           >
//             <span className="truncate">
//               {item.nombre}{" "}
//               <span className="text-gray-500 dark:text-gray-400">
//                 x{item.quantity}
//               </span>
//             </span>
//             <span>
//               $
//               {(
//                 Number(item.precio ?? 0) * Number(item.quantity ?? 0)
//               ).toLocaleString("es-AR")}
//             </span>
//           </li>
//         ))}
//       </ul>

//       <div className="border-t border-gray-200 dark:border-gray-800 pt-2 space-y-1 text-sm">
//         <div className="flex justify-between text-gray-700 dark:text-gray-300">
//           <span>Subtotal</span>
//           <span>
//             $
//             {Number(subtotal).toLocaleString("es-AR")}
//           </span>
//         </div>

//         {descuentoMonto > 0 && (
//           <div className="flex justify-between text-emerald-600 dark:text-emerald-400 text-sm">
//             <span>Descuento</span>
//             <span>
//               -
//               {Number(descuentoMonto ?? 0).toLocaleString("es-AR")}
//             </span>
//           </div>
//         )}

//         <div className="flex justify-between text-gray-900 dark:text-gray-100 font-semibold pt-1">
//           <span>Total</span>
//           <span>
//             $
//             {Number(totalFinal ?? 0).toLocaleString("es-AR")}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutSummary;
// src/components/checkout/CheckoutSummary.jsx
import { useCart } from "../../context/CartContext";
import { useCoupon } from "../../context/CouponContext";

const CheckoutSummary = () => {
  const { items, totalAmount } = useCart();
  const { descuentoMonto, totalConDescuento, hasCuponAplicado } = useCoupon();

  const subtotal = Number(totalAmount ?? 0);

  // ✅ total final solo usa totalConDescuento si hay cupón aplicado
  const totalFinal = hasCuponAplicado
    ? Number(totalConDescuento ?? subtotal)
    : subtotal;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm p-4 space-y-3">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        Resumen de compra
      </h3>

      <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300 max-h-40 overflow-y-auto pr-1">
        {items.map((item) => {
          const qty = Number(item.quantity ?? 0);
          const price = Number(item.precio ?? 0);
          return (
            <li key={item.id} className="flex justify-between gap-2">
              <span className="truncate">
                {item.nombre}{" "}
                <span className="text-gray-500 dark:text-gray-400">x{qty}</span>
              </span>
              <span>${(price * qty).toLocaleString("es-AR")}</span>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-2 space-y-1 text-sm">
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString("es-AR")}</span>
        </div>

        {hasCuponAplicado && descuentoMonto > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 text-sm">
            <span>Descuento</span>
            <span>-{Number(descuentoMonto).toLocaleString("es-AR")}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-900 dark:text-gray-100 font-semibold pt-1">
          <span>Total</span>
          <span>${Number(totalFinal ?? 0).toLocaleString("es-AR")}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
