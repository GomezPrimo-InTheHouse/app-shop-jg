

// // import { useEffect, useMemo, useRef, useState } from "react";
// // import { useLocation, Link } from "react-router-dom";
// // import {
// //   CheckCircle2,
// //   ReceiptText,
// //   ArrowLeft,
// //   Copy,
// //   Check,
// //   ShoppingBag,
// //   ExternalLink,
// // } from "lucide-react";
// // import ShopHeader from "../components/layout/ShopHeader.jsx";
// // import { getVentaByIdApi } from "../api/shopApi";

// // // ⚠️ Solo para armar URLs de imágenes si vienen como path relativo.
// // // Tu VITE_API_URL_BACKEND suele ser ".../shop". Acá le quitamos "/shop".
// // const API_URL =
// //   import.meta.env.VITE_API_URL_BACKEND?.replace("/shop", "") || "";

// // const getSafeUrl = (path) => {
// //   if (!path) return null;
// //   if (String(path).startsWith("http")) return path;
// //   return `${API_URL}${path}`;
// // };

// // const formatARS = (value) =>
// //   Number(value || 0).toLocaleString("es-AR", {
// //     style: "currency",
// //     currency: "ARS",
// //     maximumFractionDigits: 0,
// //   });

// // const ConfirmacionCompraPage = () => {
// //   const location = useLocation();
// //   const [remote, setRemote] = useState(null);
// //   const [loadingRemote, setLoadingRemote] = useState(false);
// //   const [copiedField, setCopiedField] = useState(null);

// //   // ✅ Para evitar múltiples calls por re-renders (StrictMode / etc)
// //   const lastFetchedIdRef = useRef(null);

// //   // 1) Obtener ID de la venta de la URL
// //   const ventaIdFromQS = useMemo(() => {
// //     const sp = new URLSearchParams(location.search);
// //     const v = sp.get("venta_id");
// //     const n = v ? Number(v) : null;
// //     return Number.isFinite(n) ? n : null;
// //   }, [location.search]);

// //   /**
// //    * 2) API-FIRST SIEMPRE:
// //    * - Si hay venta_id => SIEMPRE fetch al backend.
// //    * - Aunque exista location.state, lo usamos solo como fallback visual mientras carga.
// //    */
// //   useEffect(() => {
// //     if (!ventaIdFromQS) return;

// //     // evita refetch del mismo id en re-renders
// //     if (lastFetchedIdRef.current === ventaIdFromQS) return;
// //     lastFetchedIdRef.current = ventaIdFromQS;

// //     setLoadingRemote(true);

// //     getVentaByIdApi(ventaIdFromQS)
// //       .then((res) => {
// //         // axios: resp?.data, pero tu helper ya retorna data o resp
// //         const data = res?.data ?? res;
// //         setRemote(data);
// //       })
// //       .catch((err) => {
// //         console.error("Error cargando venta desde API:", err);
// //         // si falla, liberamos el lock para permitir reintentar (por ejemplo, cambiando QS)
// //         lastFetchedIdRef.current = null;
// //       })
// //       .finally(() => setLoadingRemote(false));
// //   }, [ventaIdFromQS]);

// //   /**
// //    * 3) Payload:
// //    * Mientras remote llega, mostramos location.state para que no quede “vacío”.
// //    * Cuando llega remote, gana remote.
// //    */
// //   const payload = remote || location.state || null;

// //   // Si está cargando y NO hay nada que mostrar aún
// //   if (loadingRemote && !payload) {
// //     return (
// //       <div className="min-h-screen bg-slate-950 flex items-center justify-center">
// //         <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
// //       </div>
// //     );
// //   }

// //   // Si no hay venta_id o no hay payload
// //   if (!ventaIdFromQS && !payload) {
// //     return (
// //       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
// //         <p className="text-slate-400">No encontramos información de tu pedido.</p>
// //         <Link
// //           to="/"
// //           className="text-indigo-400 underline uppercase text-xs font-bold tracking-widest"
// //         >
// //           Ir al inicio
// //         </Link>
// //       </div>
// //     );
// //   }

// //   if (!payload && !loadingRemote) {
// //     return (
// //       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
// //         <p className="text-slate-400">No encontramos información de tu pedido.</p>
// //         <Link
// //           to="/"
// //           className="text-indigo-400 underline uppercase text-xs font-bold tracking-widest"
// //         >
// //           Ir al inicio
// //         </Link>
// //       </div>
// //     );
// //   }

// //   // --- NORMALIZACIÓN (sin cambiar tu UI, solo robustez) ---
// //   const venta = payload?.venta || payload;
// //   const detalles = payload?.detalles || payload?.items || [];

// //   const total_bruto =
// //     payload?.total_bruto ?? venta?.total_bruto ?? venta?.total ?? 0;
// //   const descuento = payload?.descuento ?? venta?.descuento ?? 0;
// //   const total_final =
// //     payload?.total_final ??
// //     venta?.total_final ??
// //     (Number(total_bruto || 0) - Number(descuento || 0));

// //   const datosCliente =
// //     venta?.cliente || {
// //       nombre: venta?.nombre || payload?.nombre || "Cliente",
// //       apellido: venta?.apellido || payload?.apellido || "",
// //     };

// //   // WhatsApp (igual que lo tenías)
// //   const handleWhatsAppRedirect = () => {
// //     const productosStr = (Array.isArray(detalles) ? detalles : [])
// //       .map((item) => {
// //         const nombre =
// //           item?.producto_nombre || item?.producto?.nombre || "Producto";
// //         return `%0A• ${nombre} (x${item?.cantidad ?? 1})`;
// //       })
// //       .join("");

// //     const mensaje =
// //       `¡Hola JG SHOP! 👋%0A%0A` +
// //       `*NUEVO PEDIDO:* #${venta?.id || "S/N"}%0A` +
// //       `*CLIENTE:* ${datosCliente.nombre} ${datosCliente.apellido}%0A` +
// //       `*TOTAL:* ${formatARS(total_final)}%0A%0A` +
// //       `*DETALLE:*${productosStr}%0A%0A` +
// //       `Adjunto el comprobante de transferencia abajo:`;

// //     window.open(`https://wa.me/5493534275476?text=${mensaje}`, "_blank");
// //   };

// //   const copyToClipboard = (text, field) => {
// //     navigator.clipboard.writeText(text);
// //     setCopiedField(field);
// //     setTimeout(() => setCopiedField(null), 2000);
// //   };

// //   return (
// //     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
// //       <ShopHeader />

// //       <main className="max-w-7xl mx-auto px-4 py-12">
// //         {/* HEADER ÉXITO */}
// //         <div className="text-center mb-16 animate-in fade-in zoom-in duration-500">
// //           <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald-500/30">
// //             <CheckCircle2 className="h-10 w-10 text-emerald-500" />
// //           </div>
// //           <h1 className="text-5xl font-black italic uppercase tracking-tighter">
// //             Pedido Recibido
// //           </h1>
// //           <p className="text-slate-400 font-bold tracking-widest uppercase text-xs mt-2">
// //             JG SHOP OFFICIAL • ORDEN #{venta?.id}
// //             {loadingRemote ? " • actualizando..." : ""}
// //           </p>
// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //           {/* BLOQUE IZQUIERDO: PAGOS */}
// //           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
// //             {/* CARD TRANSFERENCIA */}
// //             <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 flex flex-col shadow-sm">
// //               <div className="flex items-center gap-3 mb-8">
// //                 <ReceiptText className="h-6 w-6 text-indigo-500" />
// //                 <h3 className="font-black italic uppercase text-xl text-white">
// //                   Transferencia
// //                 </h3>
// //               </div>

// //               <div className="flex-1 space-y-6">
// //                 <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 space-y-4">
// //                   <div className="text-sm">
// //                     <p className="font-bold text-base">Julian Agustin Gomez</p>
// //                     <p className="text-xs text-slate-500 italic">
// //                       Brubank | CUIT 20-39173125-0
// //                     </p>
// //                   </div>

// //                   <div className="space-y-2">
// //                     <button
// //                       onClick={() =>
// //                         copyToClipboard("1430001713017789840017", "cbu")
// //                       }
// //                       className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500 transition-colors group"
// //                     >
// //                       <span className="text-[10px] font-mono font-bold">
// //                         CBU: ...840017
// //                       </span>
// //                       {copiedField === "cbu" ? (
// //                         <Check className="h-4 w-4 text-emerald-500" />
// //                       ) : (
// //                         <Copy className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
// //                       )}
// //                     </button>

// //                     <button
// //                       onClick={() => copyToClipboard("julian.gomez.inf", "alias")}
// //                       className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500 transition-colors group"
// //                     >
// //                       <span className="text-[10px] font-mono font-bold">
// //                         ALIAS: julian.gomez.inf
// //                       </span>
// //                       {copiedField === "alias" ? (
// //                         <Check className="h-4 w-4 text-emerald-500" />
// //                       ) : (
// //                         <Copy className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
// //                       )}
// //                     </button>
// //                   </div>
// //                 </div>

// //                 <div className="mt-auto text-center">
// //                   <div className="inline-block bg-white p-3 rounded-2xl shadow-lg border border-slate-100 mb-3">
// //                     <img
// //                       src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=julian.gomez.inf`}
// //                       alt="QR"
// //                       className="h-24 w-24"
// //                     />
// //                   </div>
// //                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
// //                     Escaneá para pagar
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* CARD WHATSAPP */}
// //             <div className="rounded-[2.5rem] bg-indigo-600 p-8 text-white flex flex-col shadow-xl shadow-indigo-500/20">
// //               <div className="flex items-center gap-3 mb-8">
// //                 <ShoppingBag className="h-6 w-6" />
// //                 <h3 className="font-black italic uppercase text-xl">Confirmar</h3>
// //               </div>

// //               <div className="flex-1 flex flex-col justify-between">
// //                 <div>
// //                   <h4 className="text-2xl font-black italic uppercase mb-4 leading-tight">
// //                     Acción Rápida
// //                   </h4>
// //                   <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-6">
// //                     Hola {datosCliente.nombre}, al presionar el botón enviaremos tu
// //                     pedido #{venta?.id} por WhatsApp para coordinar la entrega.
// //                   </p>
// //                 </div>

// //                 <div className="mt-auto">
// //                   <button
// //                     onClick={handleWhatsAppRedirect}
// //                     className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-6 text-sm font-black italic uppercase text-indigo-600 hover:bg-slate-50 transition-all active:scale-95 shadow-xl group"
// //                   >
// //                     Enviar Pedido
// //                     <ExternalLink className="h-4 w-4" />
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* ASIDE DERECHO: TOTALES */}
// //           <aside className="lg:col-span-1">
// //             <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 shadow-lg sticky top-8">
// //               <h3 className="font-black italic uppercase text-[10px] tracking-[0.3em] text-indigo-500 mb-8 text-center">
// //                 Estado de Cuenta
// //               </h3>

// //               <div className="space-y-4 mb-8">
// //                 <div className="flex justify-between text-xs font-bold uppercase italic">
// //                   <span className="text-slate-400">Subtotal</span>
// //                   <span>{formatARS(total_bruto)}</span>
// //                 </div>

// //                 {Number(descuento) > 0 && (
// //                   <div className="flex justify-between text-xs font-bold uppercase italic text-emerald-500">
// //                     <span>Bonificación</span>
// //                     <span>-{formatARS(descuento)}</span>
// //                   </div>
// //                 )}

// //                 <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col items-center">
// //                   <span className="text-[9px] font-black uppercase text-slate-400 mb-1 italic">
// //                     Total Final
// //                   </span>
// //                   <span className="text-5xl font-black italic text-indigo-600 dark:text-indigo-400 leading-none">
// //                     {formatARS(total_final)}
// //                   </span>
// //                 </div>
// //               </div>

// //               <Link
// //                 to="/"
// //                 className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-200 dark:border-white/10 py-5 text-[10px] font-black italic uppercase hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-white"
// //               >
// //                 <ArrowLeft className="h-3 w-3" /> Volver a la Tienda
// //               </Link>
// //             </div>
// //           </aside>
// //         </div>

// //         {/* DETALLE PRODUCTOS ABAJO */}
// //         <div className="mt-12 rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 md:p-12">
// //           <h2 className="font-black italic uppercase text-xl mb-10 border-l-4 border-indigo-500 pl-4 text-white">
// //             Tu Selección
// //           </h2>

// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
// //             {(Array.isArray(detalles) ? detalles : []).map((item, idx) => (
// //               <div
// //                 key={item?.id ?? `${item?.producto_id ?? "p"}-${idx}`}
// //                 className="flex items-center gap-4 py-4 border-b border-slate-100 dark:border-white/5 last:border-0"
// //               >
// //                 <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
// //                   <img
// //                     // ✅ Si en detalles viene foto_url como path, lo armamos con API_URL.
// //                     // ✅ Si no viene, usamos un placeholder que NO rompe DNS.
// //                     src={getSafeUrl(item?.foto_url) || "https://placehold.co/100x100?text=JG"}
// //                     alt={item?.producto_nombre || item?.producto?.nombre || "Producto"}
// //                     className="h-full w-full object-cover"
// //                     loading="lazy"
// //                   />
// //                 </div>

// //                 <div className="flex-1 min-w-0">
// //                   <h4 className="font-black italic uppercase text-[11px] truncate text-white">
// //                     {item?.producto_nombre || item?.producto?.nombre || `Producto #${item?.producto_id ?? ""}`}
// //                   </h4>
// //                   <p className="text-[9px] text-indigo-500 font-bold uppercase italic">
// //                     CANT: {item?.cantidad ?? 1}
// //                   </p>
// //                 </div>

// //                 <div className="font-black italic text-sm text-white">
// //                   {formatARS(item?.subtotal ?? item?.total ?? 0)}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // export default ConfirmacionCompraPage;
// import { useEffect, useMemo, useRef, useState } from "react";
// import { useLocation, Link } from "react-router-dom";
// import {
//   CheckCircle2,
//   ReceiptText,
//   ArrowLeft,
//   Copy,
//   Check,
//   ShoppingBag,
//   ExternalLink,
// } from "lucide-react";
// import ShopHeader from "../components/layout/ShopHeader.jsx";
// import { getVentaByIdApi } from "../api/shopApi";
// import QRBrubank from "../assets/QR-BRUBANK.jpg";
// // ⚠️ Solo para armar URLs de imágenes si vienen como path relativo.
// // Tu VITE_API_URL_BACKEND suele ser ".../shop". Acá le quitamos "/shop".
// const API_URL =
//   import.meta.env.VITE_API_URL_BACKEND?.replace("/shop", "") || "";

// const getSafeUrl = (path) => {
//   if (!path) return null;
//   if (String(path).startsWith("http")) return path;
//   return `${API_URL}${path}`;
// };

// const formatARS = (value) =>
//   Number(value || 0).toLocaleString("es-AR", {
//     style: "currency",
//     currency: "ARS",
//     maximumFractionDigits: 0,
//   });

// const ConfirmacionCompraPage = () => {
//   const location = useLocation();
//   const [remote, setRemote] = useState(null);
//   const [loadingRemote, setLoadingRemote] = useState(false);
//   const [copiedField, setCopiedField] = useState(null);

//   // ✅ Para evitar múltiples calls por re-renders (StrictMode / etc)
//   const lastFetchedIdRef = useRef(null);

//   // 1) Obtener ID de la venta de la URL
//   const ventaIdFromQS = useMemo(() => {
//     const sp = new URLSearchParams(location.search);
//     const v = sp.get("venta_id");
//     const n = v ? Number(v) : null;
//     return Number.isFinite(n) ? n : null;
//   }, [location.search]);

//   /**
//    * 2) API-FIRST SIEMPRE:
//    * - Si hay venta_id => SIEMPRE fetch al backend.
//    * - Aunque exista location.state, lo usamos solo como fallback visual mientras carga.
//    */
//   useEffect(() => {
//     if (!ventaIdFromQS) return;

//     // evita refetch del mismo id en re-renders
//     if (lastFetchedIdRef.current === ventaIdFromQS) return;
//     lastFetchedIdRef.current = ventaIdFromQS;

//     setLoadingRemote(true);

//     getVentaByIdApi(ventaIdFromQS)
//       .then((res) => {
//         // axios: resp?.data, pero tu helper ya retorna data o resp
//         const data = res?.data ?? res;
//         setRemote(data);
//       })
//       .catch((err) => {
//         console.error("Error cargando venta desde API:", err);
//         // si falla, liberamos el lock para permitir reintentar (por ejemplo, cambiando QS)
//         lastFetchedIdRef.current = null;
//       })
//       .finally(() => setLoadingRemote(false));
//   }, [ventaIdFromQS]);

//   /**
//    * 3) Payload:
//    * Mientras remote llega, mostramos location.state para que no quede “vacío”.
//    * Cuando llega remote, gana remote.
//    */
//   const payload = remote || location.state || null;

//   // Si está cargando y NO hay nada que mostrar aún
//   if (loadingRemote && !payload) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center">
//         <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   // Si no hay venta_id o no hay payload
//   if (!ventaIdFromQS && !payload) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
//         <p className="text-slate-400">No encontramos información de tu pedido.</p>
//         <Link
//           to="/"
//           className="text-indigo-400 underline uppercase text-xs font-bold tracking-widest"
//         >
//           Ir al inicio
//         </Link>
//       </div>
//     );
//   }

//   if (!payload && !loadingRemote) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
//         <p className="text-slate-400">No encontramos información de tu pedido.</p>
//         <Link
//           to="/"
//           className="text-indigo-400 underline uppercase text-xs font-bold tracking-widest"
//         >
//           Ir al inicio
//         </Link>
//       </div>
//     );
//   }

//   // --- NORMALIZACIÓN (sin cambiar tu UI, solo robustez) ---
//   const venta = payload?.venta || payload;

//   // ✅ puede venir en payload.detalles (como tu JSON), payload.items, o incluso venta.detalles
//   const detalles =
//     payload?.detalles ||
//     payload?.items ||
//     venta?.detalles ||
//     [];

//   const total_bruto =
//     payload?.total_bruto ?? venta?.total_bruto ?? venta?.total ?? 0;
//   const descuento = payload?.descuento ?? venta?.descuento ?? 0;
//   const total_final =
//     payload?.total_final ??
//     venta?.total_final ??
//     (Number(total_bruto || 0) - Number(descuento || 0));

//   const datosCliente =
//     venta?.cliente || {
//       nombre: venta?.nombre || payload?.nombre || "Cliente",
//       apellido: venta?.apellido || payload?.apellido || "",
//     };


//   const handleWhatsAppRedirect = () => {
//     // 1. Validamos que tengamos detalles para no enviar un mensaje vacío
//     const listaProductos = Array.isArray(detalles) ? detalles : [];

//     // 2. Construimos el string de productos con limpieza de strings
//     const productosTexto = listaProductos
//       .map((item) => {
//         const nombre = item?.producto_nombre || item?.producto?.nombre || "Producto";
//         const cant = item?.cantidad ?? 1;
//         return `• ${nombre} (x${cant})`;
//       })
//       .join("\n");

//     // 3. Construimos el cuerpo del mensaje (usando saltos de línea naturales \n)
//     const mensajeFormateado =
//       `¡Hola JG SHOP! 👋\n\n` +
//       `*NUEVO PEDIDO:* #${venta?.id || "S/N"}\n` +
//       `*CLIENTE:* ${datosCliente.nombre} ${datosCliente.apellido}\n` +
//       `*TOTAL:* ${formatARS(total_final)}\n\n` +
//       `*DETALLE:*\n${productosTexto}\n\n` +
//       `Adjunto el comprobante de transferencia abajo:`;

//     /**
//      * 4. EL SECRETO: encodeURIComponent
//      * Esto convierte automáticamente los emojis, espacios, asteriscos y el 
//      * símbolo de pesos ($) a un formato que WhatsApp entiende perfectamente.
//      */
//     const mensajeFinal = encodeURIComponent(mensajeFormateado);

//     window.open(`https://wa.me/5493534275476?text=${mensajeFinal}`, "_blank");
//   };
//   const copyToClipboard = (text, field) => {
//     navigator.clipboard.writeText(text);
//     setCopiedField(field);
//     setTimeout(() => setCopiedField(null), 2000);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
//       <ShopHeader />

//       <main className="max-w-7xl mx-auto px-4 py-12">
//         {/* HEADER ÉXITO */}
//         <div className="text-center mb-16 animate-in fade-in zoom-in duration-500">
//           <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald-500/30">
//             <CheckCircle2 className="h-10 w-10 text-emerald-500" />
//           </div>
//           <h1 className="text-5xl font-black italic uppercase tracking-tighter">
//             Pedido Recibido
//           </h1>
//           <p className="text-slate-400 font-bold tracking-widest uppercase text-xs mt-2">
//             JG SHOP OFFICIAL • ORDEN #{venta?.id}
//             {loadingRemote ? " • actualizando..." : ""}
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* BLOQUE IZQUIERDO: PAGOS */}
//           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* CARD TRANSFERENCIA */}
//             <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 flex flex-col shadow-sm">
//               <div className="flex items-center gap-3 mb-8">
//                 <ReceiptText className="h-6 w-6 text-indigo-500" />
//                 <h3 className="font-black italic uppercase text-xl text-gray-900 dark:text-white">
//                   Transferencia
//                 </h3>
//               </div>

//               <div className="flex-1 space-y-6">
//                 <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 space-y-4">
//                   <div className="text-sm">
//                     <p className="font-bold text-base">Julian Agustin Gomez</p>
//                     <p className="text-xs text-slate-500 italic">
//                       Brubank | CUIT 20-39173125-0
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <button
//                       onClick={() =>
//                         copyToClipboard("1430001713017789840017", "cbu")
//                       }
//                       className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500 transition-colors group"
//                     >
//                       <span className="text-[10px] font-mono font-bold">
//                         CBU: ...840017
//                       </span>
//                       {copiedField === "cbu" ? (
//                         <Check className="h-4 w-4 text-emerald-500" />
//                       ) : (
//                         <Copy className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
//                       )}
//                     </button>

//                     <button
//                       onClick={() => copyToClipboard("julian.gomez.inf", "alias")}
//                       className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500 transition-colors group"
//                     >
//                       <span className="text-[10px] font-mono font-bold">
//                         ALIAS: julian.gomez.inf
//                       </span>
//                       {copiedField === "alias" ? (
//                         <Check className="h-4 w-4 text-emerald-500" />
//                       ) : (
//                         <Copy className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* <div className="mt-auto text-center">
//                   <div className="inline-block bg-white p-3 rounded-2xl shadow-lg border border-slate-100 mb-3">
//                     <img
//                       src={QRBrubank}
//                       alt="QR"
//                       className="h-30 w-30"
//                     />
//                   </div>
//                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                     Escaneá para pagar
//                   </p>
//                 </div> */}
//               </div>
//             </div>

//             {/* CARD WHATSAPP */}
//             <div className="rounded-[2.5rem] bg-indigo-600 p-8 text-white flex flex-col shadow-xl shadow-indigo-500/20">
//               <div className="flex items-center gap-3 mb-8">
//                 <ShoppingBag className="h-6 w-6" />
//                 <h3 className="font-black italic uppercase text-xl">Confirmar</h3>
//               </div>

//               <div className="flex-1 flex flex-col justify-between">
//                 <div>
//                   <h4 className="text-2xl font-black italic uppercase mb-4 leading-tight">
//                     Acción Rápida
//                   </h4>
//                   <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-6">
//                     Hola {datosCliente.nombre}, al presionar el botón enviaremos tu
//                     pedido #{venta?.id} por WhatsApp para coordinar la entrega.
//                   </p>
//                 </div>

//                 <div className="mt-auto">
//                   <button
//                     onClick={handleWhatsAppRedirect}
//                     className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-6 text-sm font-black italic uppercase text-indigo-600 hover:bg-slate-50 transition-all active:scale-95 shadow-xl group"
//                   >
//                     Enviar Pedido
//                     <ExternalLink className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ASIDE DERECHO: TOTALES */}
//           <aside className="lg:col-span-1">
//             <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 shadow-lg sticky top-8">
//               <h3
//                 className="font-black italic uppercase text-[10px] tracking-[0.3em] text-indigo-700 dark:text-indigo-400 mb-8 text-center"
//               >
//                 Estado de Cuenta
//               </h3>


//               <div className="space-y-4 mb-8">
//                 <div className="flex justify-between text-xs font-bold uppercase italic">
//                   <span className="text-slate-400">Subtotal</span>
//                   <span>{formatARS(total_bruto)}</span>
//                 </div>

//                 {Number(descuento) > 0 && (
//                   <div className="flex justify-between text-xs font-bold uppercase italic text-emerald-500">
//                     <span>Bonificación</span>
//                     <span>-{formatARS(descuento)}</span>
//                   </div>
//                 )}

//                 <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col items-center">
//                   <span className="text-[9px] font-black uppercase text-slate-400 mb-1 italic">
//                     Total Final
//                   </span>
//                   <span className="text-5xl font-black italic text-indigo-600 dark:text-indigo-400 leading-none">
//                     {formatARS(total_final)}
//                   </span>
//                 </div>
//               </div>

//               <Link
//                 to="/"
//                 className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-200 dark:border-white/10 py-5 text-[10px] font-black italic uppercase hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-white"
//               >
//                 <ArrowLeft className="h-3 w-3" /> Volver a la Tienda
//               </Link>
//             </div>
//           </aside>
//         </div>

//         {/* DETALLE PRODUCTOS ABAJO */}
//         <section className="mt-12 rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-500">
//           <div className="flex items-center justify-between mb-10">
//             <h2 className="font-black italic uppercase text-2xl border-l-4 border-indigo-500 pl-4 text-slate-900 dark:text-white tracking-tight">
//               Tu Selección
//             </h2>
//             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">
//               {detalles.length} Artículos
//             </span>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-2">
//             {(Array.isArray(detalles) ? detalles : []).map((item, idx) => {
//               const nombre = item?.producto_nombre || item?.producto?.nombre || `Producto #${item?.producto_id ?? ""}`;
//               const img = item?.imagen_url || item?.foto_url || item?.producto?.imagen_url || item?.producto?.foto_url || null;
//               const cantidad = Number(item?.cantidad ?? 1);
//               const subtotal = item?.subtotal ?? (cantidad * Number(item?.precio_unitario ?? 0));

//               return (
//                 <div
//                   key={item?.id ?? `${item?.producto_id ?? "p"}-${idx}`}
//                   className="group flex items-center gap-5 py-5 border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] px-2 -mx-2 rounded-2xl transition-all duration-300"
//                 >
//                   {/* Contenedor de Imagen con Ratio Fijo */}
//                   <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0 shadow-sm border border-slate-200/50 dark:border-white/5">
//                     <img
//                       src={getSafeUrl(img) || "https://placehold.co/100x100?text=JG"}
//                       alt={nombre}
//                       className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
//                       loading="lazy"
//                     />
//                     {/* Overlay sutil en dark mode */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent hidden dark:block" />
//                   </div>

//                   <div className="flex-1 min-w-0 space-y-1">
//                     <h4 className="font-black italic uppercase text-xs md:text-sm truncate text-slate-800 dark:text-slate-100 tracking-wide">
//                       {nombre}
//                     </h4>
//                     <div className="flex items-center gap-3">
//                       <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase italic bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">
//                         CANT: {cantidad}
//                       </p>
//                       {item?.precio_unitario && (
//                         <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase italic">
//                           u. {formatARS(item.precio_unitario)}
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <div className="text-right flex flex-col items-end">
//                     <span className="font-black italic text-base text-slate-900 dark:text-white">
//                       {formatARS(subtotal)}
//                     </span>
//                     <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Subtotal</span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default ConfirmacionCompraPage;
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  CheckCircle2,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  CreditCard,
  Banknote,
} from "lucide-react";
import ShopHeader from "../components/layout/ShopHeader.jsx";
import { getVentaByIdApi } from "../api/shopApi";

const API = import.meta.env.VITE_API_URL_BACKEND;
const API_URL = import.meta.env.VITE_API_URL_BACKEND?.replace("/shop", "") || "";

const getSafeUrl = (path) => {
  if (!path) return null;
  if (String(path).startsWith("http")) return path;
  return `${API_URL}${path}`;
};

const formatARS = (value) =>
  Number(value || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

// ─── Botón copiar con feedback ────────────────────────────────────────────────
const CopyButton = ({ value, label }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl
                 bg-slate-50 dark:bg-white/5
                 border border-slate-200 dark:border-white/10
                 hover:border-slate-400 dark:hover:border-white/30
                 transition-colors group"
    >
      <span className="font-mono text-xs text-slate-700 dark:text-slate-300">{label}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0" />
      )}
    </button>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const ConfirmacionCompraPage = () => {
  const location = useLocation();
  const [remote, setRemote] = useState(null);
  const [loadingRemote, setLoadingRemote] = useState(false);
  const [loadingMP, setLoadingMP] = useState(false);
  const lastFetchedIdRef = useRef(null);

  const ventaIdFromQS = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const v = sp.get("venta_id");
    const n = v ? Number(v) : null;
    return Number.isFinite(n) ? n : null;
  }, [location.search]);

  useEffect(() => {
    if (!ventaIdFromQS) return;
    if (lastFetchedIdRef.current === ventaIdFromQS) return;
    lastFetchedIdRef.current = ventaIdFromQS;
    setLoadingRemote(true);
    getVentaByIdApi(ventaIdFromQS)
      .then((res) => setRemote(res?.data ?? res))
      .catch((err) => {
        console.error("Error cargando venta:", err);
        lastFetchedIdRef.current = null;
      })
      .finally(() => setLoadingRemote(false));
  }, [ventaIdFromQS]);

  const payload = remote || location.state || null;

  if (loadingRemote && !payload) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="h-10 w-10 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if ((!ventaIdFromQS && !payload) || (!payload && !loadingRemote)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4 text-slate-900 dark:text-white">
        <p className="text-slate-500">No encontramos información de tu pedido.</p>
        <Link to="/" className="text-sm underline text-slate-500 hover:text-slate-700">
          Ir al inicio
        </Link>
      </div>
    );
  }

  // ── Normalización ─────────────────────────────────────────────────────────
  const venta = payload?.venta || payload;
  const detalles = payload?.detalles || payload?.items || venta?.detalles || [];
  const total_bruto = payload?.total_bruto ?? venta?.total_bruto ?? venta?.total ?? 0;
  const descuento = payload?.descuento ?? venta?.descuento ?? 0;
  const total_final =
    payload?.total_final ??
    venta?.total_final ??
    Number(total_bruto || 0) - Number(descuento || 0);

  const datosCliente = venta?.cliente || {
    nombre: venta?.nombre || payload?.nombre || "Cliente",
    apellido: venta?.apellido || payload?.apellido || "",
  };

  // ── WhatsApp ──────────────────────────────────────────────────────────────
  const handleWhatsAppRedirect = () => {
    const lista = Array.isArray(detalles) ? detalles : [];
    const productosTexto = lista
      .map((item) => {
        const nombre = item?.producto_nombre || item?.producto?.nombre || "Producto";
        return `• ${nombre} (x${item?.cantidad ?? 1})`;
      })
      .join("\n");

    const msg =
      `¡Hola JG SHOP! 👋\n\n` +
      `*NUEVO PEDIDO:* #${venta?.id || "S/N"}\n` +
      `*CLIENTE:* ${datosCliente.nombre} ${datosCliente.apellido}\n` +
      `*TOTAL:* ${formatARS(total_final)}\n\n` +
      `*DETALLE:*\n${productosTexto}\n\n` +
      `Adjunto el comprobante de transferencia abajo:`;

    window.open(`https://wa.me/5493534275476?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // ── Mercado Pago ──────────────────────────────────────────────────────────
  const handleMercadoPago = async () => {
    setLoadingMP(true);
    try {
      const res = await fetch(`${API}/shop/pagos/mercadopago`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venta_id: venta?.id,
          cliente: datosCliente,
          items: (Array.isArray(detalles) ? detalles : []).map((item) => ({
            title: item?.producto_nombre || item?.producto?.nombre || "Producto",
            quantity: Number(item?.cantidad ?? 1),
            unit_price: Number(item?.precio_unitario ?? 0),
          })),
          total: Number(total_final),
        }),
      });
      const data = await res.json();
      if (data?.init_point) {
        window.open(data.init_point, "_blank");
      } else {
        alert("No se pudo iniciar el pago con Mercado Pago. Intentá por transferencia.");
      }
    } catch (err) {
      console.error("Error MP:", err);
      alert("Error al conectar con Mercado Pago.");
    } finally {
      setLoadingMP(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <ShopHeader />

      <main className="max-w-6xl mx-auto px-4 py-10 sm:py-14">

        {/* ── Encabezado ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-emerald-200 dark:ring-emerald-500/30 mb-5">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Pedido recibido
          </h1>
          <p className="mt-1.5 text-sm text-slate-400 tracking-widest uppercase">
            JG Shop · Orden #{venta?.id}
            {loadingRemote && (
              <span className="ml-2 text-xs normal-case text-slate-400">actualizando…</span>
            )}
          </p>
        </div>

        {/* ── 3 cards superiores ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          {/* Card 1: Transferencia */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-slate-400" />
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Transferencia
              </h3>
            </div>

            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Julian Agustín Gomez
              </p>
              <p className="text-xs text-slate-400">Brubank · CUIT 20-39173125-0</p>
            </div>

            <div className="space-y-2">
              <CopyButton value="1430001713017789840017" label="CBU: ...840017" />
              <CopyButton value="julian.gomez.inf" label="ALIAS: julian.gomez.inf" />
            </div>

            <div className="flex flex-col items-center gap-2 pt-1">
              <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=julian.gomez.inf"
                  alt="QR alias"
                  className="h-24 w-24"
                />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">
                Escaneá para pagar
              </p>
            </div>
          </div>

          {/* Card 2: Confirmar por WhatsApp */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-slate-400" />
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Confirmar pedido
              </h3>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Hola{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {datosCliente.nombre}
                </span>
                , enviá tu pedido{" "}
                <span className="font-semibold">#{venta?.id}</span> por WhatsApp
                para coordinar el pago y la entrega.
              </p>

              <button
                onClick={handleWhatsAppRedirect}
                className="flex items-center justify-center gap-2 w-full rounded-xl
                           bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.98]
                           px-4 py-3 text-sm font-medium text-white transition"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Enviar pedido por WhatsApp
                <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" />
              </button>
            </div>
          </div>

          {/* Card 3: Totales + Mercado Pago */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-slate-400" />
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Resumen
              </h3>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="font-medium">{formatARS(total_bruto)}</span>
              </div>

              {Number(descuento) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400">Descuento</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    -{formatARS(descuento)}
                  </span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-widest text-slate-400">Total</span>
                  <span className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {formatARS(total_final)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleMercadoPago}
              disabled={loadingMP}
              className="flex items-center justify-center gap-2 w-full rounded-xl
                         bg-[#009EE3] hover:bg-[#0090d0] active:scale-[0.98]
                         disabled:opacity-60 disabled:cursor-not-allowed
                         px-4 py-3 text-sm font-medium text-white transition"
            >
              {loadingMP ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 48 48" fill="white">
                  <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4zm0 6c3.9 0 7.4 1.4 10.2 3.6L13.6 34.2A14 14 0 0 1 10 24c0-7.7 6.3-14 14-14zm0 28c-3.9 0-7.4-1.4-10.2-3.6l20.6-20.6A14 14 0 0 1 38 24c0 7.7-6.3 14-14 14z"/>
                </svg>
              )}
              {loadingMP ? "Conectando…" : "Pagar con Mercado Pago"}
              {!loadingMP && <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" />}
            </button>

            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 text-xs text-slate-400
                         hover:text-slate-600 dark:hover:text-slate-300 transition"
            >
              <ArrowLeft className="h-3 w-3" />
              Volver a la tienda
            </Link>
          </div>
        </div>

        {/* ── Detalle de productos ── */}
        <section className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Tu selección
            </h2>
            <span className="text-xs text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">
              {detalles.length} {detalles.length === 1 ? "artículo" : "artículos"}
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {(Array.isArray(detalles) ? detalles : []).map((item, idx) => {
              const nombre =
                item?.producto_nombre ||
                item?.producto?.nombre ||
                `Producto #${item?.producto_id ?? ""}`;
              const img =
                item?.imagen_url ||
                item?.foto_url ||
                item?.producto?.imagen_url ||
                item?.producto?.foto_url ||
                null;
              const cantidad = Number(item?.cantidad ?? 1);
              const precioUnitario = Number(item?.precio_unitario ?? 0);
              const subtotal =
                item?.subtotal != null
                  ? Number(item.subtotal)
                  : precioUnitario * cantidad;

              return (
                <div
                  key={item?.id ?? `${item?.producto_id ?? "p"}-${idx}`}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="h-14 w-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-100 dark:border-white/5">
                    <img
                      src={getSafeUrl(img) || "https://placehold.co/100x100?text=JG"}
                      alt={nombre}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                      {nombre}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-400">Cant: {cantidad}</span>
                      {precioUnitario > 0 && (
                        <span className="text-xs text-slate-400">
                          u. {formatARS(precioUnitario)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatARS(subtotal)}
                    </p>
                    {cantidad > 1 && (
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                        subtotal
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
};

export default ConfirmacionCompraPage;