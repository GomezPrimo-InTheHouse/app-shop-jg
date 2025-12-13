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
import { useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import ShopHeader from "../components/layout/ShopHeader.jsx";

const LS_LAST_ORDER = "jg_shop_last_order";

const ConfirmacionCompraPage = () => {
  const location = useLocation();

  // ✅ fuente primaria: lo que viene del backend al navegar (state)
  const state = location.state || {};

  // soporta: state = data (backend)  OR  state = { venta, ... }
  // pero preferimos siempre el shape "backend response": { venta, detalles, total_bruto, descuento, total_final, codigo_cupon }
  const fromState = useMemo(() => {
    if (state?.venta) return state;                 // ya viene shape correcto
    if (state?.data?.venta) return state.data;     // por error: { data: backend }
    if (state?.resp?.data?.venta) return state.resp.data; // por error: { resp: axiosResponse }
    return null;
  }, [state]);

  // ✅ fallback desde localStorage SOLO si no hay state
  const fromStorage = useMemo(() => {
    if (fromState) return null; // si hay state, ignoramos storage para evitar mezclas
    try {
      const raw = localStorage.getItem(LS_LAST_ORDER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [fromState]);

  const payload = fromState || fromStorage || null;

  const venta = payload?.venta ?? null;
  const detalles = Array.isArray(payload?.detalles) ? payload.detalles : [];

  // ✅ SOLO CAMPOS BACKEND (sin alias del front)
  const total_bruto = payload?.total_bruto ?? null;
  const descuento = payload?.descuento ?? 0;
  const total_final = payload?.total_final ?? venta?.total ?? null;
  const codigo_cupon = payload?.codigo_cupon ?? null;

  const formatPrice = (value) =>
    Number(value ?? 0).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });

  const tieneDatos = !!venta?.id;

  // ✅ si vino state (backend), lo persistimos como "última compra"
  // (y sobrescribimos cualquier cosa vieja)
  useEffect(() => {
    if (!fromState?.venta?.id) return;

    const save = {
      venta: fromState.venta,
      detalles: Array.isArray(fromState.detalles) ? fromState.detalles : [],
      total_bruto: fromState.total_bruto ?? null,
      descuento: fromState.descuento ?? 0,
      total_final: fromState.total_final ?? fromState.venta?.total ?? null,
      codigo_cupon: fromState.codigo_cupon ?? null,
    };

    localStorage.setItem(LS_LAST_ORDER, JSON.stringify(save));
  }, [fromState]);

  return (
    <div
      className="min-h-screen flex flex-col
                 bg-gray-100 dark:bg-gray-900
                 text-gray-900 dark:text-gray-100
                 transition-colors duration-500"
    >
      <ShopHeader />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <h1 className="text-2xl font-semibold">
            {tieneDatos ? "¡Gracias por tu compra!" : "Compra registrada"}
          </h1>

          {tieneDatos ? (
            <section
              className="rounded-2xl border border-gray-200 dark:border-gray-800
                         bg-white/80 dark:bg-gray-950/80
                         backdrop-blur-sm p-4 sm:p-6 space-y-4 shadow-lg"
            >
              {/* Resumen pedido */}
              <div className="space-y-1 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  Número de pedido: <span className="font-semibold">#{venta.id}</span>
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Fecha:{" "}
                  {venta.fecha ? new Date(venta.fecha).toLocaleString("es-AR") : "-"}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Canal: {venta.canal || "web_shop"}
                </p>

                {/* ✅ Cupón SOLO si backend lo confirma */}
                {codigo_cupon && Number(descuento) > 0 && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Cupón aplicado: <span className="font-semibold">{codigo_cupon}</span>
                  </p>
                )}
              </div>

              {/* Totales (backend truth) */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(total_bruto ?? 0)}</span>
                </div>

                {Number(descuento) > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Descuento</span>
                    <span>-{formatPrice(descuento)}</span>
                  </div>
                )}

                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formatPrice(total_final ?? 0)}</span>
                </div>
              </div>

              {/* Detalle productos */}
              {detalles.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <h2 className="text-sm font-semibold mb-2">Detalle de productos</h2>

                  <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                    {detalles.map((d) => {
                      const subtotalSeguro =
                        d?.subtotal ??
                        (Number(d?.precio_unitario ?? 0) * Number(d?.cantidad ?? 0));

                      return (
                        <li
                          key={d.id ?? `${d.producto_id}-${d.cantidad}`}
                          className="flex justify-between gap-2"
                        >
                          <span className="truncate">
                            Producto #{d.producto_id}{" "}
                            <span className="text-gray-500 dark:text-gray-400">
                              x{d.cantidad}
                            </span>
                          </span>
                          <span>{formatPrice(subtotalSeguro)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                Nos vamos a comunicar con vos para coordinar el{" "}
                <span className="font-semibold">método de pago y entrega</span>.
              </p>
            </section>
          ) : (
            <section
              className="rounded-2xl border border-gray-200 dark:border-gray-800
                         bg-white/80 dark:bg-gray-950/80
                         backdrop-blur-sm p-4 sm:p-6 text-sm text-gray-700 dark:text-gray-300"
            >
              <p>Tu compra fue registrada, pero no encontramos el detalle completo en esta vista.</p>
              <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                Si recargaste la página, puede haberse perdido el estado temporal.
                Igual podés volver a la tienda o consultar por WhatsApp.
              </p>
            </section>
          )}

          <div className="flex gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center
                         rounded-full border border-gray-300 dark:border-gray-700
                         bg-white dark:bg-gray-900
                         px-4 py-2 text-sm font-medium
                         text-gray-800 dark:text-gray-100
                         hover:bg-gray-100 dark:hover:bg-gray-800
                         transition-colors"
            >
              ← Volver a la tienda
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmacionCompraPage;
