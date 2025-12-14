// // src/pages/ConfirmacionCompraPage.jsx
// import { useEffect, useMemo } from "react";
// import { useLocation, Link } from "react-router-dom";
// import ShopHeader from "../components/layout/ShopHeader.jsx";

// const LS_LAST_ORDER = "jg_shop_last_order";

// const ConfirmacionCompraPage = () => {
//   const location = useLocation();

//   // ✅ Soporta varios formatos de navegación:
//   // - navigate(..., { state: { venta, detalles, ... } })
//   // - navigate(..., { state: { data: { venta, ... } } }) (por error)
//   // - navigate(..., { state: { resp } }) (axios response)
//   const state = location.state || {};
//   const fromState =
//     state?.venta
//       ? state
//       : state?.data?.venta
//       ? state.data
//       : state?.resp?.data?.venta
//       ? state.resp.data
//       : null;

//   // ✅ backup desde localStorage si state viene vacío (ej: recarga)
//   const fromStorage = useMemo(() => {
//     try {
//       const raw = localStorage.getItem(LS_LAST_ORDER);
//       return raw ? JSON.parse(raw) : null;
//     } catch {
//       return null;
//     }
//   }, []);

//   const payload = fromState || fromStorage || {};

//   const venta = payload?.venta ?? null;
//   const detalles = payload?.detalles ?? [];
//   const total_bruto = payload?.total_bruto ?? payload?.totalBruto ?? null;
//   const descuento = payload?.descuento ?? payload?.descuentoMonto ?? 0;
//   const total_final = payload?.total_final ?? payload?.totalFinal ?? venta?.total ?? null;

//   const formatPrice = (value) =>
//     Number(value ?? 0).toLocaleString("es-AR", {
//       style: "currency",
//       currency: "ARS",
//       maximumFractionDigits: 0,
//     });

//   const tieneDatos = !!venta?.id;

//   // ✅ guardamos la última compra para no perderla si el usuario recarga
//   useEffect(() => {
//     if (!tieneDatos) return;

//     const save = {
//       venta,
//       detalles,
//       total_bruto,
//       descuento,
//       total_final,
//     };

//     localStorage.setItem(LS_LAST_ORDER, JSON.stringify(save));
//   }, [tieneDatos, venta, detalles, total_bruto, descuento, total_final]);

//   return (
//     <div
//       className="min-h-screen flex flex-col
//                  bg-gray-100 dark:bg-gray-900
//                  text-gray-900 dark:text-gray-100
//                  transition-colors duration-500"
//     >
//       <ShopHeader />

//       <main className="flex-1">
//         <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
//           <h1 className="text-2xl font-semibold">
//             {tieneDatos ? "¡Gracias por tu compra!" : "Compra registrada"}
//           </h1>

//           {tieneDatos ? (
//             <section
//               className="rounded-2xl border border-gray-200 dark:border-gray-800
//                          bg-white/80 dark:bg-gray-950/80
//                          backdrop-blur-sm p-4 sm:p-6 space-y-4 shadow-lg"
//             >
//               {/* Resumen pedido */}
//               <div className="space-y-1 text-sm">
//                 <p className="text-gray-700 dark:text-gray-300">
//                   Número de pedido:{" "}
//                   <span className="font-semibold">#{venta.id}</span>
//                 </p>

//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   Fecha:{" "}
//                   {venta.fecha
//                     ? new Date(venta.fecha).toLocaleString("es-AR")
//                     : "-"}
//                 </p>

//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   Canal: {venta.canal || "web_shop"}
//                 </p>
//               </div>

//               {/* Totales */}
//               <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-3 text-sm">
//                 <div className="flex justify-between">
//                   <span>Subtotal</span>
//                   <span>{formatPrice(total_bruto)}</span>
//                 </div>

//                 {Number(descuento) > 0 && (
//                   <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
//                     <span>Descuento</span>
//                     <span>-{formatPrice(descuento)}</span>
//                   </div>
//                 )}

//                 <div className="flex justify-between font-semibold text-base">
//                   <span>Total</span>
//                   <span>{formatPrice(total_final)}</span>
//                 </div>
//               </div>

//               {/* Detalle productos */}
//               {Array.isArray(detalles) && detalles.length > 0 && (
//                 <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
//                   <h2 className="text-sm font-semibold mb-2">
//                     Detalle de productos
//                   </h2>

//                   <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
//                     {detalles.map((d) => (
//                       <li key={d.id ?? `${d.producto_id}-${d.cantidad}`} className="flex justify-between gap-2">
//                         <span className="truncate">
//                           Producto #{d.producto_id}{" "}
//                           <span className="text-gray-500 dark:text-gray-400">
//                             x{d.cantidad}
//                           </span>
//                         </span>
//                         <span>{formatPrice(d.subtotal)}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
//                 Nos vamos a comunicar con vos para coordinar el{" "}
//                 <span className="font-semibold">método de pago y entrega</span>.
//               </p>
//             </section>
//           ) : (
//             <section
//               className="rounded-2xl border border-gray-200 dark:border-gray-800
//                          bg-white/80 dark:bg-gray-950/80
//                          backdrop-blur-sm p-4 sm:p-6 text-sm text-gray-700 dark:text-gray-300"
//             >
//               <p>
//                 Tu compra fue registrada, pero no encontramos el detalle completo en esta vista.
//               </p>
//               <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
//                 Si recargaste la página, puede haberse perdido el estado temporal.
//                 Igual podés volver a la tienda o consultar por WhatsApp.
//               </p>
//             </section>
//           )}

//           <div className="flex gap-3">
//             <Link
//               to="/"
//               className="inline-flex items-center justify-center
//                          rounded-full border border-gray-300 dark:border-gray-700
//                          bg-white dark:bg-gray-900
//                          px-4 py-2 text-sm font-medium
//                          text-gray-800 dark:text-gray-100
//                          hover:bg-gray-100 dark:hover:bg-gray-800
//                          transition-colors"
//             >
//               ← Volver a la tienda
//             </Link>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ConfirmacionCompraPage;

// src/pages/ConfirmacionCompraPage.jsx
// src/pages/ConfirmacionCompraPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCoupon } from "../context/CouponContext";

const LS_LAST_ORDER = "jg_shop_last_order";

const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const formatARS = (n) =>
  toNumber(n, 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

export default function ConfirmacionCompraPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Limpieza extra por seguridad (no afecta a los números mostrados porque usamos backend)
  const { limpiarCupon } = useCoupon();
  useEffect(() => {
    limpiarCupon?.();
  }, [limpiarCupon]);

  const [order, setOrder] = useState(null);

  useEffect(() => {
    // 1) Preferimos state (flujo normal)
    if (location.state) {
      setOrder(location.state);
      return;
    }

    // 2) Fallback si recargó la página
    try {
      const raw = localStorage.getItem(LS_LAST_ORDER);
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      setOrder(null);
    }
  }, [location.state]);

  const view = useMemo(() => {
    if (!order) return null;

    // ✅ SOLO backend
    const subtotal = toNumber(order.total_bruto ?? order.totalBruto ?? 0);
    const descuento = toNumber(order.descuento ?? 0);
    const total = toNumber(order.total_final ?? order.totalFinal ?? subtotal - descuento);

    const numeroPedido = order?.venta?.id ?? order?.venta_id ?? order?.venta?.numero ?? null;
    const fecha = order?.venta?.fecha ?? order?.venta?.created_at ?? order?.fecha ?? null;
    const canal = order?.venta?.canal ?? order?.canal ?? "web_shop";

    const detalles = Array.isArray(order?.detalles) ? order.detalles : [];

    return { subtotal, descuento, total, numeroPedido, fecha, canal, detalles, codigoCupon: order?.codigo_cupon ?? null };
  }, [order]);

  if (!view) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-gray-200">
        <h1 className="text-2xl font-semibold">No encontramos el pedido</h1>
        <p className="mt-2 text-sm text-gray-400">
          Volvé a la tienda y realizá una compra para ver la confirmación.
        </p>
        <button
          className="mt-6 rounded-full border border-white/10 px-5 py-2 text-sm hover:bg-white/5"
          onClick={() => navigate("/")}
        >
          ← Volver a la tienda
        </button>
      </div>
    );
  }

  const showDiscount = view.descuento > 0; // ✅ si backend devolvió 0, NO se muestra

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 text-gray-100">
      <h1 className="text-3xl font-semibold mb-6">¡Gracias por tu compra!</h1>

      <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur p-6">
        <div className="text-sm text-gray-300 space-y-1">
          {view.numeroPedido && <p>Número de pedido: <span className="font-semibold">#{view.numeroPedido}</span></p>}
          {view.fecha && <p>Fecha: {new Date(view.fecha).toLocaleString("es-AR")}</p>}
          <p>Canal: {view.canal}</p>

          {/* ✅ Si querés, mostrar el cupón SOLO si backend lo aplicó */}
          {showDiscount && view.codigoCupon && (
            <p className="text-emerald-400">Cupón aplicado: {view.codigoCupon}</p>
          )}
        </div>

        <div className="my-6 border-t border-white/10" />

        <div className="space-y-3 text-lg">
          <div className="flex justify-between">
            <span className="font-semibold">Subtotal</span>
            <span>{formatARS(view.subtotal)}</span>
          </div>

          {showDiscount && (
            <div className="flex justify-between text-emerald-400">
              <span className="font-semibold">Descuento</span>
              <span>-{formatARS(view.descuento)}</span>
            </div>
          )}

          <div className="flex justify-between text-2xl font-bold pt-2">
            <span>Total</span>
            <span>{formatARS(view.total)}</span>
          </div>
        </div>

        <div className="my-6 border-t border-white/10" />

        <h3 className="text-lg font-semibold mb-3">Detalle de productos</h3>

        <div className="space-y-2 text-sm text-gray-200">
          {view.detalles.length === 0 ? (
            <p className="text-gray-400">Sin detalles disponibles.</p>
          ) : (
            view.detalles.map((d, idx) => (
              <div key={d?.id ?? idx} className="flex justify-between">
                <span>
                  {d?.producto_nombre ?? `Producto #${d?.producto_id ?? "?"}`}{" "}
                  <span className="text-gray-400">x{d?.cantidad ?? 1}</span>
                </span>
                <span>{formatARS(d?.subtotal ?? (toNumber(d?.precio_unitario, 0) * toNumber(d?.cantidad, 1)))}</span>
              </div>
            ))
          )}
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Nos vamos a comunicar con vos para coordinar el método de pago y entrega.
        </p>
      </div>

      <button
        className="mt-8 rounded-full border border-white/10 px-6 py-3 text-sm hover:bg-white/5"
        onClick={() => navigate("/")}
      >
        ← Volver a la tienda
      </button>
    </div>
  );
}

