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
import { useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle2, ReceiptText, Package, ArrowLeft } from "lucide-react";
import ShopHeader from "../components/layout/ShopHeader.jsx";

const LS_LAST_ORDER = "jg_shop_last_order";

const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const formatARS = (value) =>
  toNumber(value, 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

const ConfirmacionCompraPage = () => {
  const location = useLocation();

  /**
   * ✅ Soporta varios formatos de navegación:
   * - navigate(..., { state: { venta, detalles, ... } })
   * - navigate(..., { state: { data: { venta, ... } } })
   * - navigate(..., { state: { resp } }) (axios response)
   */
  const state = location.state || {};
  const fromState =
    state?.venta
      ? state
      : state?.data?.venta
      ? state.data
      : state?.resp?.data?.venta
      ? state.resp.data
      : null;

  // ✅ backup desde localStorage si state viene vacío (ej: recarga)
  const fromStorage = useMemo(() => {
    try {
      const raw = localStorage.getItem(LS_LAST_ORDER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  // ✅ Payload final (fuente de verdad = lo que mandó backend)
  const payload = fromState || fromStorage || {};

  // ✅ SOLO backend (nada de contexts acá)
  const venta = payload?.venta ?? null;
  const detalles = Array.isArray(payload?.detalles) ? payload.detalles : [];

  // Totales "backend first"
  const total_bruto = payload?.total_bruto ?? payload?.totalBruto ?? null;
  const descuento = payload?.descuento ?? 0;
  const total_final =
    payload?.total_final ??
    payload?.totalFinal ??
    venta?.total ??
    (toNumber(total_bruto, 0) - toNumber(descuento, 0));

  const codigoCupon = payload?.codigo_cupon ?? null; // mostrar SOLO si descuento > 0
  const tieneDatos = !!venta?.id;

  // ✅ Guardamos la última compra para no perderla si recargan
  useEffect(() => {
    if (!tieneDatos) return;

    const save = {
      venta,
      detalles,
      total_bruto,
      descuento: toNumber(descuento, 0),
      total_final: toNumber(total_final, 0),
      codigo_cupon: codigoCupon ?? null,
    };

    try {
      localStorage.setItem(LS_LAST_ORDER, JSON.stringify(save));
    } catch {
      // ignore
    }
  }, [tieneDatos, venta, detalles, total_bruto, descuento, total_final, codigoCupon]);

  const showDiscount = toNumber(descuento, 0) > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <ShopHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-10">
          {/* HERO / HEADLINE */}
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">
                {tieneDatos ? "Pedido confirmado" : "Compra registrada"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              {tieneDatos ? "¡Gracias por tu compra!" : "Listo, registramos tu compra"}
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl">
              {tieneDatos
                ? "Te vamos a contactar para coordinar el método de pago y la entrega. Guardá el número de pedido por cualquier consulta."
                : "No encontramos el detalle completo en esta vista. Podés volver a la tienda o consultarnos por WhatsApp."}
            </p>
          </div>

          {/* CONTENT GRID */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: Detalle + Totales */}
            <section className="lg:col-span-2 space-y-6">
              {/* Card: Pedido */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 sm:p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <ReceiptText className="h-5 w-5 text-slate-200" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold">
                        Información del pedido
                      </h2>
                      <p className="text-xs text-slate-400">
                        Datos principales de la operación
                      </p>
                    </div>
                  </div>

                  {/* Chip */}
                  {tieneDatos && (
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                      Pedido <span className="font-semibold">#{venta.id}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="text-[11px] text-slate-400">Fecha</p>
                    <p className="mt-1 font-medium text-slate-100">
                      {venta?.fecha ? new Date(venta.fecha).toLocaleString("es-AR") : "-"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="text-[11px] text-slate-400">Canal</p>
                    <p className="mt-1 font-medium text-slate-100">
                      {venta?.canal || "web_shop"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="text-[11px] text-slate-400">Estado</p>
                    <p className="mt-1 font-medium text-slate-100">
                      {venta?.estado_nombre || "PENDIENTE_PAGO"}
                    </p>
                  </div>
                </div>

                {/* Totales */}
                <div className="mt-6 border-t border-white/10 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-200">
                    <span className="text-slate-300">Subtotal</span>
                    <span className="font-medium">{formatARS(total_bruto)}</span>
                  </div>

                  {showDiscount && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-400">
                        Descuento {codigoCupon ? `(Cupón ${codigoCupon})` : ""}
                      </span>
                      <span className="font-semibold text-emerald-400">
                        -{formatARS(descuento)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-base font-semibold text-slate-100">
                      Total
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-slate-100">
                      {formatARS(total_final)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card: Productos */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-slate-200" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold">
                      Detalle de productos
                    </h2>
                    <p className="text-xs text-slate-400">
                      Ítems incluidos en tu compra
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  {Array.isArray(detalles) && detalles.length > 0 ? (
                    <ul className="divide-y divide-white/10">
                      {detalles.map((d, idx) => {
                        const key = d?.id ?? `${d?.producto_id ?? "p"}-${idx}`;
                        const qty = toNumber(d?.cantidad, 1);
                        const lineTotal = d?.subtotal ?? null;

                        return (
                          <li key={key} className="py-3 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-100 truncate">
                                {d?.producto_nombre ?? `Producto #${d?.producto_id ?? "?"}`}
                              </p>
                              <p className="text-xs text-slate-400">
                                Cantidad: <span className="font-medium text-slate-200">x{qty}</span>
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-sm font-semibold text-slate-100">
                                {formatARS(lineTotal)}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
                      No hay detalle de productos disponible en esta vista.
                    </div>
                  )}
                </div>

                <p className="mt-5 text-xs text-slate-400">
                  Nos vamos a comunicar con vos para coordinar el{" "}
                  <span className="font-semibold text-slate-200">
                    método de pago y entrega
                  </span>
                  .
                </p>
              </div>
            </section>

            {/* RIGHT: Acciones / next steps */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
                <h3 className="text-sm font-semibold text-slate-100">
                  Próximos pasos
                </h3>

                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Te contactamos para coordinar pago y entrega.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Guardá el número de pedido para consultas.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Si necesitás, podés escribirnos por WhatsApp.
                  </li>
                </ul>

                <div className="mt-5">
                  <Link
                    to="/"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full
                               border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-semibold
                               text-slate-100 hover:bg-white/10 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a la tienda
                  </Link>
                </div>
              </div>

              {/* Tip extra / confianza */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-slate-300">
                <p className="font-semibold text-slate-100">Tip</p>
                <p className="mt-1 text-sm text-slate-300">
                  Si querés acelerar la coordinación, respondé con tu dirección y horario
                  disponible cuando te contactemos.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmacionCompraPage;


