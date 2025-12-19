
// src/pages/ConfirmacionCompraPage.jsx
// import { useEffect, useMemo, useState } from "react";
// import { useLocation, Link } from "react-router-dom";
// import { CheckCircle2, ReceiptText, Package, ArrowLeft, AlertTriangle } from "lucide-react";
// import ShopHeader from "../components/layout/ShopHeader.jsx";
// import { getVentaByIdApi } from "../api/shopApi";

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

// const normalize = (raw) => {
//   if (!raw) return null;
//   const a = raw?.data ? raw.data : raw;
//   const b = a?.data ? a.data : a;
//   const c = b?.resp?.data ? b.resp.data : b;
//   return c;
// };

// const isFresh = (payload) => {
//   const savedAt = Number(payload?.saved_at ?? 0);
//   if (!savedAt) return false;
//   return Date.now() - savedAt <= MAX_AGE_MS;
// };

// const ConfirmacionCompraPage = () => {
//   const location = useLocation();
//   const [remote, setRemote] = useState(null);
//   const [loadingRemote, setLoadingRemote] = useState(false);

//   // query param venta_id
//   const ventaIdFromQS = useMemo(() => {
//     const sp = new URLSearchParams(location.search);
//     const v = sp.get("venta_id");
//     return v ? Number(v) : null;
//   }, [location.search]);

//   const fromState = useMemo(() => normalize(location.state), [location.state]);

//   const fromStorage = useMemo(() => {
//     try {
//       const raw = localStorage.getItem(LS_LAST_ORDER);
//       if (!raw) return null;
//       const parsed = JSON.parse(raw);
//       const normalized = normalize(parsed);
//       if (!normalized) return null;
//       if (!isFresh(normalized)) return null;
//       return normalized;
//     } catch {
//       return null;
//     }
//   }, []);

//   // payload base (primero state, después storage, después remote)
//   const payload = remote || fromState || fromStorage || null;

//   // ✅ Si tengo venta_id en URL y el payload NO trae detalles/venta => busco al backend
//   useEffect(() => {
//     const needsFetch =
//       !!ventaIdFromQS &&
//       (!fromState || !fromState?.venta || !Array.isArray(fromState?.detalles));

//     if (!needsFetch) return;

//     setLoadingRemote(true);
//     getVentaByIdApi(ventaIdFromQS)
//       .then((data) => {
//         const normalized = normalize(data);
//         if (normalized) {
//           const saved = { ...normalized, saved_at: Date.now() };
//           setRemote(saved);
//           try {
//             localStorage.setItem(LS_LAST_ORDER, JSON.stringify(saved));
//           } catch {}
//         }
//       })
//       .finally(() => setLoadingRemote(false));
//   }, [ventaIdFromQS, fromState]);

//   if (!payload && !loadingRemote) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
//         <ShopHeader />
//         <main className="flex-1">
//           <div className="mx-auto max-w-3xl px-4 py-10">
//             <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
//               <div className="flex items-start gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
//                   <AlertTriangle className="h-5 w-5 text-amber-300" />
//                 </div>
//                 <div>
//                   <h1 className="text-xl sm:text-2xl font-semibold">
//                     No encontramos el detalle del pedido
//                   </h1>
//                   <p className="mt-2 text-sm text-slate-300">
//                     Puede pasar si recargaste la página. Intentá volver a la tienda.
//                   </p>

//                   <div className="mt-5">
//                     <Link
//                       to="/"
//                       className="inline-flex items-center justify-center gap-2 rounded-full
//                                  border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-semibold
//                                  text-slate-100 hover:bg-white/10 transition-colors"
//                     >
//                       <ArrowLeft className="h-4 w-4" />
//                       Volver a la tienda
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   // backend completo o mínimo
//   const venta = payload?.venta ?? null;
//   const detalles = Array.isArray(payload?.detalles) ? payload.detalles : [];

//   const orderId = venta?.id ?? payload?.venta_id ?? null;

//   const total_bruto = payload?.total_bruto ?? null;
//   const descuento = toNumber(payload?.descuento, 0);

//   const total_final =
//     payload?.total_final ?? (toNumber(total_bruto, 0) - descuento);

//   const showDiscount = descuento > 0;

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
//       <ShopHeader />

//       <main className="flex-1">
//         <div className="mx-auto max-w-5xl px-4 py-10">
//           <div className="flex flex-col gap-2">
//             <div className="inline-flex items-center gap-2 text-emerald-400">
//               <CheckCircle2 className="h-5 w-5" />
//               <span className="text-sm font-medium">
//                 {loadingRemote ? "Cargando detalle..." : "Pedido confirmado"}
//               </span>
//             </div>

//             <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
//               ¡Gracias por tu compra!
//             </h1>

//             <p className="text-sm text-slate-300 max-w-2xl">
//               Te vamos a contactar para coordinar el método de pago y la entrega.
//             </p>
//           </div>

//           <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <section className="lg:col-span-2 space-y-6">
//               <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 sm:p-6">
//                 <div className="flex items-start justify-between gap-4">
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
//                       <ReceiptText className="h-5 w-5 text-slate-200" />
//                     </div>
//                     <div>
//                       <h2 className="text-base sm:text-lg font-semibold">
//                         Información del pedido
//                       </h2>
//                       <p className="text-xs text-slate-400">Datos principales</p>
//                     </div>
//                   </div>

//                   <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
//                     Pedido <span className="font-semibold">#{orderId ?? "—"}</span>
//                   </div>
//                 </div>

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
//                     <span className="text-base font-semibold text-slate-100">Total</span>
//                     <span className="text-xl sm:text-2xl font-bold text-slate-100">
//                       {formatARS(total_final)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 sm:p-6">
//                 <div className="flex items-center gap-3">
//                   <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
//                     <Package className="h-5 w-5 text-slate-200" />
//                   </div>
//                   <div>
//                     <h2 className="text-base sm:text-lg font-semibold">Detalle de productos</h2>
//                     <p className="text-xs text-slate-400">Ítems incluidos</p>
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   {detalles.length > 0 ? (
//                     <ul className="divide-y divide-white/10">
//                       {detalles.map((d, idx) => (
//                         <li key={d?.id ?? `${d?.producto_id}-${idx}`} className="py-3 flex justify-between gap-3">
//                           <div className="min-w-0">
//                             <p className="text-sm font-medium truncate">
//                               {d?.producto_nombre ?? `Producto #${d?.producto_id}`}
//                             </p>
//                             <p className="text-xs text-slate-400">
//                               Cantidad: <span className="text-slate-200 font-medium">x{d?.cantidad}</span>
//                             </p>
//                           </div>
//                           <div className="text-sm font-semibold">{formatARS(d?.subtotal)}</div>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
//                       No hay detalle de productos disponible en esta vista.
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </section>

//             <aside className="space-y-4">
//               <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
//                 <Link
//                   to="/"
//                   className="inline-flex w-full items-center justify-center gap-2 rounded-full
//                              border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-semibold
//                              text-slate-100 hover:bg-white/10 transition-colors"
//                 >
//                   <ArrowLeft className="h-4 w-4" />
//                   Volver a la tienda
//                 </Link>
//               </div>
//             </aside>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ConfirmacionCompraPage;

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

  const payload = remote || fromState || fromStorage || null;

  // ✅ “detalle completo” = que al menos un detalle tenga producto con foto/nombre/precio/etc
  const hasFullProducts = useMemo(() => {
    const detalles = Array.isArray(payload?.detalles) ? payload.detalles : [];
    return detalles.some((d) => d?.producto && (d?.producto?.nombre || d?.producto?.foto_url));
  }, [payload]);

  // ✅ Si hay venta_id y NO tengo detalles completos => fetch remoto sí o sí
  useEffect(() => {
    const shouldFetch =
      !!ventaIdFromQS && (!payload?.venta || !Array.isArray(payload?.detalles) || !hasFullProducts);

    if (!shouldFetch) return;

    setLoadingRemote(true);
    getVentaByIdApi(ventaIdFromQS)
      .then((data) => {
        const normalized = normalize(data);
        if (normalized) {
          const saved = { ...normalized, saved_at: Date.now() };
          setRemote(saved);
          try {
            localStorage.setItem(LS_LAST_ORDER, JSON.stringify(saved));
          } catch { }
        }
      })
      .finally(() => setLoadingRemote(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ventaIdFromQS]);

  // ✅ Theme correcto (sin hardcode oscuro)
  const Shell = ({ children }) => (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <ShopHeader />
      {children}
    </div>
  );

  if (!payload && !loadingRemote) {
    return (
      <Shell>
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-10">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/60 backdrop-blur p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-300" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold">
                    No encontramos el detalle del pedido
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Puede pasar si recargaste la página. Intentá volver a la tienda.
                  </p>

                  <div className="mt-5">
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center gap-2 rounded-full
                                 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950
                                 px-4 py-2.5 text-sm font-semibold
                                 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
      </Shell>
    );
  }

  const venta = payload?.venta ?? null;
  const detalles = Array.isArray(payload?.detalles) ? payload.detalles : [];

  const orderId = venta?.id ?? payload?.venta_id ?? null;

  const total_bruto = payload?.total_bruto ?? null;
  const descuento = toNumber(payload?.descuento, 0);
  const total_final = payload?.total_final ?? (toNumber(total_bruto, 0) - descuento);
  const showDiscount = descuento > 0;

  const fallbackImg =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>
    <rect width='100%' height='100%' fill='#F3F4F6'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
      fill='#6B7280' font-family='Arial' font-size='20'>
      Sin Imagen JG
    </text>
  </svg>
`);


  return (
    <Shell>
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">
                {loadingRemote ? "Cargando detalle..." : "Pedido confirmado"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              ¡Gracias por tu compra!
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
              Te vamos a contactar para coordinar el método de pago y la entrega.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 space-y-6">
              {/* Info pedido */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/60 backdrop-blur p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                      <ReceiptText className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold">Información del pedido</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Datos principales</p>
                    </div>
                  </div>

                  <div className="rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-1 text-xs">
                    Pedido <span className="font-semibold">#{orderId ?? "—"}</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="font-medium">{formatARS(total_bruto)}</span>
                  </div>

                  {showDiscount && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-600 dark:text-emerald-400">Descuento</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        -{formatARS(descuento)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-base font-semibold">Total</span>
                    <span className="text-xl sm:text-2xl font-bold">{formatARS(total_final)}</span>
                  </div>
                </div>
              </div>

              {/* Detalle productos FULL */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/60 backdrop-blur p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold">Detalle de productos</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ítems incluidos</p>
                  </div>
                </div>

                <div className="mt-4">
                  {detalles.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                      {detalles.map((d, idx) => {
                        const p = d?.producto || null;

                        const name = p?.nombre ?? d?.producto_nombre ?? `Producto #${d?.producto_id}`;
                        const img = p?.foto_url || d?.foto_url || fallbackImg;
                        const desc = p?.descripcion_web || p?.descripcion || "";
                        const cat = p?.categoria || null;

                        const unit = p?.precio_final ?? p?.precio ?? d?.precio_unitario ?? null;
                        const qty = toNumber(d?.cantidad, 1);
                        const subtotal = d?.subtotal ?? (unit != null ? toNumber(unit) * qty : null);

                        return (
                          <li key={d?.id ?? `${d?.producto_id}-${idx}`} className="py-4 flex gap-3">
                            <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                              <img
                                src={img}
                                alt={name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  if (e.currentTarget.dataset.fallbackApplied) return;
                                  e.currentTarget.dataset.fallbackApplied = "1";
                                  e.currentTarget.onerror = null; // corta el loop
                                  e.currentTarget.src = fallbackImg;
                                }}
                              />

                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold truncate">{name}</p>

                              {cat && (
                                <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                                  {cat}
                                </p>
                              )}

                              {!!desc && (
                                <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                                  {desc}
                                </p>
                              )}

                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Cantidad: <span className="font-semibold text-gray-900 dark:text-gray-100">x{qty}</span>
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-sm font-semibold">
                                {subtotal != null ? formatARS(subtotal) : "—"}
                              </p>
                              {unit != null && (
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                  {formatARS(unit)} c/u
                                </p>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 text-sm text-gray-600 dark:text-gray-300">
                      No hay detalle de productos disponible en esta vista.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/60 backdrop-blur p-5">
                <Link
                  to="/"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full
                             border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2.5 text-sm font-semibold
                             text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver a la tienda
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </Shell>
  );
};

export default ConfirmacionCompraPage;

