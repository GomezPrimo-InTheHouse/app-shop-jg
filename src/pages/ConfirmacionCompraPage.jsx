// // src/pages/ConfirmacionCompraPage.jsx
// import { useEffect, useMemo } from "react";
// import { useLocation, Link } from "react-router-dom";
// import { CheckCircle2, ReceiptText, Package, ArrowLeft } from "lucide-react";
// import ShopHeader from "../components/layout/ShopHeader.jsx";

// const LS_LAST_ORDER = "jg_shop_last_order";
// const MAX_AGE_MS = 5 * 60 * 1000; // ✅ TTL: 5 minutos

// const toNumber = (v, fallback = 0) => {
//   const n = Number(v);
//   return Number.isFinite(n) ? n : fallback;
// };

// const formatARS = (value) =>
//   toNumber(value, 0).toLocaleString("es-AR", {
//     style: "currency",
//     currency: "ARS",
//     maximumFractionDigits: 0,
//   });

// const ConfirmacionCompraPage = () => {
//   const location = useLocation();

//   /**
//    * ✅ Soporta varios formatos de navegación:
//    * - navigate(..., { state: { venta, detalles, ... } })
//    * - navigate(..., { state: { data: { venta, ... } } })
//    * - navigate(..., { state: { resp } }) (axios response)
//    */
//   const state = location.state || {};
//   const fromState =
//     state?.venta
//       ? state
//       : state?.data?.venta
//       ? state.data
//       : state?.resp?.data?.venta
//       ? state.resp.data
//       : null;

//   // ✅ Backup desde localStorage SOLO si es reciente (evita mostrar pedidos viejos con descuento)
//   const fromStorage = useMemo(() => {
//     try {
//       const raw = localStorage.getItem(LS_LAST_ORDER);
//       if (!raw) return null;

//       const parsed = JSON.parse(raw);

//       // ✅ TTL: ignorar si no tiene saved_at o es viejo
//       const savedAt = Number(parsed?.saved_at ?? 0);
//       if (!savedAt || Date.now() - savedAt > MAX_AGE_MS) return null;

//       // ✅ sanity check: si no tiene venta, no sirve
//       if (!parsed?.venta?.id) return null;

//       return parsed;
//     } catch {
//       return null;
//     }
//   }, []);

//   // ✅ Payload final: state siempre gana, storage solo si está “fresco”
//   const payload = fromState || fromStorage || {};

//   // ✅ SOLO backend (nada de contexts acá)
//   const venta = payload?.venta ?? null;
//   const detalles = Array.isArray(payload?.detalles) ? payload.detalles : [];

//   // Totales "backend first"
//   const total_bruto = payload?.total_bruto ?? payload?.totalBruto ?? null;
//   const descuento = payload?.descuento ?? 0;

//   const total_final =
//     payload?.total_final ??
//     payload?.totalFinal ??
//     venta?.total ??
//     (toNumber(total_bruto, 0) - toNumber(descuento, 0));

//   const codigoCupon = payload?.codigo_cupon ?? null;

//   const tieneDatos = !!venta?.id;

//   // ✅ Guardamos la última compra SOLO si vino por state (flujo normal)
//   // Esto evita que una confirmación abierta “a mano” pise el último pedido real.
//   useEffect(() => {
//     if (!tieneDatos) return;

//     // si llegó por state, lo persistimos “fresco”
//     if (fromState) {
//       const save = {
//         venta,
//         detalles,
//         total_bruto,
//         descuento: toNumber(descuento, 0),
//         total_final: toNumber(total_final, 0),
//         codigo_cupon: codigoCupon ?? null,
//         saved_at: Date.now(),
//       };

//       try {
//         localStorage.setItem(LS_LAST_ORDER, JSON.stringify(save));
//       } catch {
//         // ignore
//       }
//     }
//   }, [tieneDatos, fromState, venta, detalles, total_bruto, descuento, total_final, codigoCupon]);

//   // ✅ mostrar descuento SOLO si backend lo aplicó
//   const showDiscount = toNumber(descuento, 0) > 0;

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
//       <ShopHeader />

//       <main className="flex-1">
//         <div className="mx-auto max-w-5xl px-4 py-10">
//           {/* HERO */}
//           <div className="flex flex-col gap-2">
//             <div className="inline-flex items-center gap-2 text-emerald-400">
//               <CheckCircle2 className="h-5 w-5" />
//               <span className="text-sm font-medium">
//                 {tieneDatos ? "Pedido confirmado" : "Compra registrada"}
//               </span>
//             </div>

//             <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
//               {tieneDatos ? "¡Gracias por tu compra!" : "No encontramos el pedido"}
//             </h1>

//             <p className="text-sm text-slate-300 max-w-2xl">
//               {tieneDatos
//                 ? "Te vamos a contactar para coordinar el método de pago y la entrega. Guardá el número de pedido por cualquier consulta."
//                 : "Si recargaste la página o pasó mucho tiempo, es posible que se haya perdido el detalle. Volvé a la tienda."}
//             </p>

//             {/* Badge sutil si vino del storage */}
//             {tieneDatos && !fromState && fromStorage && (
//               <div className="mt-2 inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300">
//                 Mostrando el último pedido guardado (por recarga)
//               </div>
//             )}
//           </div>

//           {/* CONTENIDO */}
//           <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* LEFT */}
//             <section className="lg:col-span-2 space-y-6">
//               {/* Card: Pedido */}
//               <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 sm:p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
//                 <div className="flex items-start justify-between gap-4">
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
//                       <ReceiptText className="h-5 w-5 text-slate-200" />
//                     </div>
//                     <div>
//                       <h2 className="text-base sm:text-lg font-semibold">
//                         Información del pedido
//                       </h2>
//                       <p className="text-xs text-slate-400">
//                         Datos principales de la operación
//                       </p>
//                     </div>
//                   </div>

//                   {tieneDatos && (
//                     <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
//                       Pedido <span className="font-semibold">#{venta.id}</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
//                   <div className="rounded-xl border border-white/10 bg-black/20 p-3">
//                     <p className="text-[11px] text-slate-400">Fecha</p>
//                     <p className="mt-1 font-medium text-slate-100">
//                       {venta?.fecha ? new Date(venta.fecha).toLocaleString("es-AR") : "-"}
//                     </p>
//                   </div>

//                   <div className="rounded-xl border border-white/10 bg-black/20 p-3">
//                     <p className="text-[11px] text-slate-400">Canal</p>
//                     <p className="mt-1 font-medium text-slate-100">
//                       {venta?.canal || "web_shop"}
//                     </p>
//                   </div>

//                   <div className="rounded-xl border border-white/10 bg-black/20 p-3">
//                     <p className="text-[11px] text-slate-400">Estado</p>
//                     <p className="mt-1 font-medium text-slate-100">
//                       {venta?.estado_nombre || "PENDIENTE_PAGO"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Totales */}
//                 <div className="mt-6 border-t border-white/10 pt-4 space-y-3">
//                   <div className="flex items-center justify-between text-sm text-slate-200">
//                     <span className="text-slate-300">Subtotal</span>
//                     <span className="font-medium">{formatARS(total_bruto)}</span>
//                   </div>

//                   {showDiscount && (
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-emerald-400">
//                         Descuento {codigoCupon ? `(Cupón ${codigoCupon})` : ""}
//                       </span>
//                       <span className="font-semibold text-emerald-400">
//                         -{formatARS(descuento)}
//                       </span>
//                     </div>
//                   )}

//                   <div className="flex items-center justify-between pt-2">
//                     <span className="text-base font-semibold text-slate-100">
//                       Total
//                     </span>
//                     <span className="text-xl sm:text-2xl font-bold text-slate-100">
//                       {formatARS(total_final)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Card: Productos */}
//               <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 sm:p-6">
//                 <div className="flex items-center gap-3">
//                   <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
//                     <Package className="h-5 w-5 text-slate-200" />
//                   </div>
//                   <div>
//                     <h2 className="text-base sm:text-lg font-semibold">
//                       Detalle de productos
//                     </h2>
//                     <p className="text-xs text-slate-400">
//                       Ítems incluidos en tu compra
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   {Array.isArray(detalles) && detalles.length > 0 ? (
//                     <ul className="divide-y divide-white/10">
//                       {detalles.map((d, idx) => {
//                         const key = d?.id ?? `${d?.producto_id ?? "p"}-${idx}`;
//                         const qty = toNumber(d?.cantidad, 1);
//                         const lineTotal = d?.subtotal ?? 0;

//                         return (
//                           <li key={key} className="py-3 flex items-start justify-between gap-3">
//                             <div className="min-w-0">
//                               <p className="text-sm font-medium text-slate-100 truncate">
//                                 {d?.producto_nombre ?? `Producto #${d?.producto_id ?? "?"}`}
//                               </p>
//                               <p className="text-xs text-slate-400">
//                                 Cantidad:{" "}
//                                 <span className="font-medium text-slate-200">x{qty}</span>
//                               </p>
//                             </div>

//                             <div className="text-right">
//                               <p className="text-sm font-semibold text-slate-100">
//                                 {formatARS(lineTotal)}
//                               </p>
//                             </div>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   ) : (
//                     <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
//                       No hay detalle de productos disponible en esta vista.
//                     </div>
//                   )}
//                 </div>

//                 <p className="mt-5 text-xs text-slate-400">
//                   Nos vamos a comunicar con vos para coordinar el{" "}
//                   <span className="font-semibold text-slate-200">
//                     método de pago y entrega
//                   </span>
//                   .
//                 </p>
//               </div>
//             </section>

//             {/* RIGHT */}
//             <aside className="space-y-4">
//               <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
//                 <h3 className="text-sm font-semibold text-slate-100">
//                   Próximos pasos
//                 </h3>

//                 <ul className="mt-3 space-y-2 text-sm text-slate-300">
//                   <li className="flex gap-2">
//                     <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                     Te contactamos para coordinar pago y entrega.
//                   </li>
//                   <li className="flex gap-2">
//                     <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                     Guardá el número de pedido para consultas.
//                   </li>
//                   <li className="flex gap-2">
//                     <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                     Si necesitás, podés escribirnos por WhatsApp.
//                   </li>
//                 </ul>

//                 <div className="mt-5">
//                   <Link
//                     to="/"
//                     className="inline-flex w-full items-center justify-center gap-2 rounded-full
//                                border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-semibold
//                                text-slate-100 hover:bg-white/10 transition-colors"
//                   >
//                     <ArrowLeft className="h-4 w-4" />
//                     Volver a la tienda
//                   </Link>
//                 </div>
//               </div>

//               <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-slate-300">
//                 <p className="font-semibold text-slate-100">Tip</p>
//                 <p className="mt-1 text-sm text-slate-300">
//                   Si querés acelerar la coordinación, respondé con tu dirección y horario
//                   disponible cuando te contactemos.
//                 </p>
//               </div>
//             </aside>
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
import { CheckCircle2, ReceiptText, Package, ArrowLeft, AlertTriangle } from "lucide-react";
import ShopHeader from "../components/layout/ShopHeader.jsx";

const LS_LAST_ORDER = "jg_shop_last_order";

// ✅ TTL más realista (evita “pedido viejo” pero no te deja en blanco a los 5 min)
const MAX_AGE_MS = 60 * 60 * 1000; // 1 hora

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

// ✅ Normaliza cualquier shape que venga (state, data, resp, axios, etc.)
const normalizePayload = (raw) => {
  if (!raw) return null;

  // si llega axios response
  const a = raw?.data ? raw.data : raw;

  // si llega envuelto en { data: {...} } por navegación
  const b = a?.data ? a.data : a;

  // si llega envuelto en { resp: { data: {...} } }
  const c = b?.resp?.data ? b.resp.data : b;

  // si llega envuelto en { state: { venta... } } ya está
  const payload = c;

  // validación mínima: que exista venta (o al menos totales + detalles)
  const hasVenta = !!payload?.venta?.id;
  const hasTotals = payload?.total_bruto != null || payload?.total_final != null;
  const hasDetalles = Array.isArray(payload?.detalles) && payload.detalles.length > 0;

  if (!hasVenta && !hasTotals && !hasDetalles) return null;
  return payload;
};

// ✅ Valida si storage es “reciente” con saved_at o venta.fecha (compat legacy)
const isFreshStorage = (payload) => {
  const savedAt = Number(payload?.saved_at ?? 0);
  if (savedAt) return Date.now() - savedAt <= MAX_AGE_MS;

  // compat: si no hay saved_at, inferimos desde venta.fecha (si existe)
  const fecha = payload?.venta?.fecha ? new Date(payload.venta.fecha).getTime() : 0;
  if (fecha) return Date.now() - fecha <= MAX_AGE_MS;

  // sin timestamps -> no confiamos
  return false;
};

const ConfirmacionCompraPage = () => {
  const location = useLocation();

  // ✅ 1) Intentar desde state (siempre gana)
  const fromState = useMemo(() => normalizePayload(location.state), [location.state]);

  // ✅ 2) Fallback desde storage (solo si es “fresco”)
  const fromStorage = useMemo(() => {
    try {
      const raw = localStorage.getItem(LS_LAST_ORDER);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      const normalized = normalizePayload(parsed);
      if (!normalized) return null;

      if (!isFreshStorage(normalized)) return null;

      return normalized;
    } catch {
      return null;
    }
  }, []);

  const payload = fromState || fromStorage || null;

  // ✅ Si no hay payload válido, NO inventamos totales 0
  const venta = payload?.venta ?? null;
  const detalles = Array.isArray(payload?.detalles) ? payload.detalles : [];

  const total_bruto = payload?.total_bruto ?? payload?.totalBruto ?? null;
  const descuento = payload?.descuento ?? 0;

  const total_final =
    payload?.total_final ??
    payload?.totalFinal ??
    venta?.total ??
    (toNumber(total_bruto, 0) - toNumber(descuento, 0));

  const codigoCupon = payload?.codigo_cupon ?? null;
  const tieneDatos = !!venta?.id;

  // ✅ Guardar storage “fresco” solo si vino por state (flujo normal)
  useEffect(() => {
    if (!tieneDatos || !fromState) return;

    const save = {
      ...payload,
      saved_at: Date.now(),
    };

    try {
      localStorage.setItem(LS_LAST_ORDER, JSON.stringify(save));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tieneDatos, fromState]);

  const showDiscount = toNumber(descuento, 0) > 0;

  // ✅ Vista “sin pedido”: UX correcta (no mostrar $0)
  if (!payload || !tieneDatos) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
        <ShopHeader />

        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-10">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold">
                    No encontramos el detalle del pedido
                  </h1>
                  <p className="mt-2 text-sm text-slate-300">
                    Esto puede pasar si recargaste la página o si pasó demasiado tiempo desde la compra.
                    Igual tu compra pudo haberse registrado correctamente.
                  </p>

                  <div className="mt-5">
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center gap-2 rounded-full
                                 border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-semibold
                                 text-slate-100 hover:bg-white/10 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Volver a la tienda
                    </Link>
                  </div>

                  <p className="mt-4 text-xs text-slate-400">
                    Tip: probá volver atrás y entrar nuevamente a “Confirmación” desde el flujo de compra.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <ShopHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-10">
          {/* HERO */}
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Pedido confirmado</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              ¡Gracias por tu compra!
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl">
              Te vamos a contactar para coordinar el método de pago y la entrega.
              Guardá el número de pedido por cualquier consulta.
            </p>

            {/* Badge si vino del storage */}
            {!fromState && fromStorage && (
              <div className="mt-2 inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300">
                Mostrando el último pedido guardado (por recarga)
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 space-y-6">
              {/* Card Pedido */}
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

                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                    Pedido <span className="font-semibold">#{venta.id}</span>
                  </div>
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

              {/* Card Productos */}
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
                  {detalles.length > 0 ? (
                    <ul className="divide-y divide-white/10">
                      {detalles.map((d, idx) => {
                        const key = d?.id ?? `${d?.producto_id ?? "p"}-${idx}`;
                        const qty = toNumber(d?.cantidad, 1);
                        const lineTotal = d?.subtotal ?? 0;

                        return (
                          <li key={key} className="py-3 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-100 truncate">
                                {d?.producto_nombre ?? `Producto #${d?.producto_id ?? "?"}`}
                              </p>
                              <p className="text-xs text-slate-400">
                                Cantidad:{" "}
                                <span className="font-medium text-slate-200">x{qty}</span>
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

            {/* RIGHT */}
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
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmacionCompraPage;
