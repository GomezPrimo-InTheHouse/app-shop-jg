// // src/pages/ConfirmacionCompraPage.jsx
// import { useEffect, useMemo } from "react";
// import { useLocation, Link } from "react-router-dom";
// import { CheckCircle2, ReceiptText, Package, ArrowLeft } from "lucide-react";
// import ShopHeader from "../components/layout/ShopHeader.jsx";

// const LS_LAST_ORDER = "jg_shop_last_order";
// const MAX_AGE_MS = 60 * 60 * 1000; // 1 hora

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

// // ✅ Normaliza cualquier wrapper raro (state, axios response, etc.)
// const normalizePayload = (raw) => {
//   if (!raw) return null;

//   const a = raw?.data ? raw.data : raw;      // axios response
//   const b = a?.data ? a.data : a;            // wrapper {data:{...}}
//   const c = b?.resp?.data ? b.resp.data : b; // wrapper {resp:{data:{...}}}

//   // ✅ aceptar payload mínimo del backend
//   const hasVentaId = c?.venta_id != null;
//   const hasTotals = c?.total_bruto != null || c?.total_final != null;

//   if (!hasVentaId && !hasTotals) return null;

//   return c;
// };

// const isFreshStorage = (payload) => {
//   const savedAt = Number(payload?.saved_at ?? 0);
//   if (savedAt) return Date.now() - savedAt <= MAX_AGE_MS;
//   return false;
// };

// const ConfirmacionCompraPage = () => {
//   const location = useLocation();

//   // 1) state
//   const fromState = useMemo(() => normalizePayload(location.state), [location.state]);

//   // 2) storage (solo si es fresco)
//   const fromStorage = useMemo(() => {
//     try {
//       const raw = localStorage.getItem(LS_LAST_ORDER);
//       if (!raw) return null;

//       const parsed = JSON.parse(raw);
//       const normalized = normalizePayload(parsed);
//       if (!normalized) return null;

//       if (!isFreshStorage(normalized)) return null;

//       return normalized;
//     } catch {
//       return null;
//     }
//   }, []);

//   const payload = fromState || fromStorage || null;

//   // ✅ Si no hay payload, no inventamos $0
//   if (!payload) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
//         <ShopHeader />
//         <main className="flex-1">
//           <div className="mx-auto max-w-3xl px-4 py-10">
//             <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
//               <h1 className="text-xl sm:text-2xl font-semibold">
//                 No encontramos el detalle del pedido
//               </h1>
//               <p className="mt-2 text-sm text-slate-300">
//                 Puede pasar si recargaste la página o si el estado no llegó correctamente.
//               </p>

//               <div className="mt-5">
//                 <Link
//                   to="/"
//                   className="inline-flex items-center justify-center gap-2 rounded-full
//                              border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-semibold
//                              text-slate-100 hover:bg-white/10 transition-colors"
//                 >
//                   <ArrowLeft className="h-4 w-4" />
//                   Volver a la tienda
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   // ✅ Backend mínimo
//   const orderId = payload?.venta_id ?? null;
//   const total_bruto = payload?.total_bruto ?? null;
//   const descuento = toNumber(payload?.descuento, 0);
//   const total_final =
//     payload?.total_final ?? (toNumber(total_bruto, 0) - toNumber(descuento, 0));

//   const showDiscount = descuento > 0;

//   // ✅ guardamos payload “fresco” si vino por state
//   useEffect(() => {
//     if (!fromState) return;
//     try {
//       localStorage.setItem(
//         LS_LAST_ORDER,
//         JSON.stringify({ ...payload, saved_at: Date.now() })
//       );
//     } catch {}
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [fromState]);

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
//       <ShopHeader />

//       <main className="flex-1">
//         <div className="mx-auto max-w-5xl px-4 py-10">
//           <div className="flex flex-col gap-2">
//             <div className="inline-flex items-center gap-2 text-emerald-400">
//               <CheckCircle2 className="h-5 w-5" />
//               <span className="text-sm font-medium">Pedido confirmado</span>
//             </div>

//             <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
//               ¡Gracias por tu compra!
//             </h1>

//             <p className="text-sm text-slate-300 max-w-2xl">
//               Te vamos a contactar para coordinar el método de pago y la entrega.
//             </p>
//           </div>

//           <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* LEFT */}
//             <section className="lg:col-span-2 space-y-6">
//               {/* Pedido */}
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

//                   <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
//                     Pedido <span className="font-semibold">#{orderId ?? "—"}</span>
//                   </div>
//                 </div>

//                 <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
//                   <div className="rounded-xl border border-white/10 bg-black/20 p-3">
//                     <p className="text-[11px] text-slate-400">Fecha</p>
//                     <p className="mt-1 font-medium text-slate-100">—</p>
//                   </div>

//                   <div className="rounded-xl border border-white/10 bg-black/20 p-3">
//                     <p className="text-[11px] text-slate-400">Canal</p>
//                     <p className="mt-1 font-medium text-slate-100">web_shop</p>
//                   </div>

//                   <div className="rounded-xl border border-white/10 bg-black/20 p-3">
//                     <p className="text-[11px] text-slate-400">Estado</p>
//                     <p className="mt-1 font-medium text-slate-100">PENDIENTE_PAGO</p>
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
//                       <span className="text-emerald-400">Descuento</span>
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

//               {/* Productos */}
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
//                       El backend no devolvió el detalle en esta respuesta
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
//                   No hay detalle de productos disponible en esta vista.
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
//                 <h3 className="text-sm font-semibold text-slate-100">Acciones</h3>

//                 <div className="mt-4">
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
//             </aside>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ConfirmacionCompraPage;
// src/pages/ConfirmacionCompraPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle2, ReceiptText, Package, ArrowLeft, AlertTriangle } from "lucide-react";
import ShopHeader from "../components/layout/ShopHeader.jsx";
import { getVentaByIdApi } from "../api/shopApi";

const LS_LAST_ORDER = "jg_shop_last_order";
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

const normalize = (raw) => {
  if (!raw) return null;
  const a = raw?.data ? raw.data : raw;
  const b = a?.data ? a.data : a;
  const c = b?.resp?.data ? b.resp.data : b;
  return c;
};

const isFresh = (payload) => {
  const savedAt = Number(payload?.saved_at ?? 0);
  if (!savedAt) return false;
  return Date.now() - savedAt <= MAX_AGE_MS;
};

const ConfirmacionCompraPage = () => {
  const location = useLocation();
  const [remote, setRemote] = useState(null);
  const [loadingRemote, setLoadingRemote] = useState(false);

  // query param venta_id
  const ventaIdFromQS = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const v = sp.get("venta_id");
    return v ? Number(v) : null;
  }, [location.search]);

  const fromState = useMemo(() => normalize(location.state), [location.state]);

  const fromStorage = useMemo(() => {
    try {
      const raw = localStorage.getItem(LS_LAST_ORDER);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const normalized = normalize(parsed);
      if (!normalized) return null;
      if (!isFresh(normalized)) return null;
      return normalized;
    } catch {
      return null;
    }
  }, []);

  // payload base (primero state, después storage, después remote)
  const payload = remote || fromState || fromStorage || null;

  // ✅ Si tengo venta_id en URL y el payload NO trae detalles/venta => busco al backend
  useEffect(() => {
    const needsFetch =
      !!ventaIdFromQS &&
      (!fromState || !fromState?.venta || !Array.isArray(fromState?.detalles));

    if (!needsFetch) return;

    setLoadingRemote(true);
    getVentaByIdApi(ventaIdFromQS)
      .then((data) => {
        const normalized = normalize(data);
        if (normalized) {
          const saved = { ...normalized, saved_at: Date.now() };
          setRemote(saved);
          try {
            localStorage.setItem(LS_LAST_ORDER, JSON.stringify(saved));
          } catch {}
        }
      })
      .finally(() => setLoadingRemote(false));
  }, [ventaIdFromQS, fromState]);

  if (!payload && !loadingRemote) {
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
                    Puede pasar si recargaste la página. Intentá volver a la tienda.
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
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // backend completo o mínimo
  const venta = payload?.venta ?? null;
  const detalles = Array.isArray(payload?.detalles) ? payload.detalles : [];

  const orderId = venta?.id ?? payload?.venta_id ?? null;

  const total_bruto = payload?.total_bruto ?? null;
  const descuento = toNumber(payload?.descuento, 0);

  const total_final =
    payload?.total_final ?? (toNumber(total_bruto, 0) - descuento);

  const showDiscount = descuento > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <ShopHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">
                {loadingRemote ? "Cargando detalle..." : "Pedido confirmado"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              ¡Gracias por tu compra!
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl">
              Te vamos a contactar para coordinar el método de pago y la entrega.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <ReceiptText className="h-5 w-5 text-slate-200" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold">
                        Información del pedido
                      </h2>
                      <p className="text-xs text-slate-400">Datos principales</p>
                    </div>
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                    Pedido <span className="font-semibold">#{orderId ?? "—"}</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-200">
                    <span className="text-slate-300">Subtotal</span>
                    <span className="font-medium">{formatARS(total_bruto)}</span>
                  </div>

                  {showDiscount && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-400">Descuento</span>
                      <span className="font-semibold text-emerald-400">
                        -{formatARS(descuento)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-base font-semibold text-slate-100">Total</span>
                    <span className="text-xl sm:text-2xl font-bold text-slate-100">
                      {formatARS(total_final)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-slate-200" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold">Detalle de productos</h2>
                    <p className="text-xs text-slate-400">Ítems incluidos</p>
                  </div>
                </div>

                <div className="mt-4">
                  {detalles.length > 0 ? (
                    <ul className="divide-y divide-white/10">
                      {detalles.map((d, idx) => (
                        <li key={d?.id ?? `${d?.producto_id}-${idx}`} className="py-3 flex justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {d?.producto_nombre ?? `Producto #${d?.producto_id}`}
                            </p>
                            <p className="text-xs text-slate-400">
                              Cantidad: <span className="text-slate-200 font-medium">x{d?.cantidad}</span>
                            </p>
                          </div>
                          <div className="text-sm font-semibold">{formatARS(d?.subtotal)}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
                      No hay detalle de productos disponible en esta vista.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
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
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmacionCompraPage;
