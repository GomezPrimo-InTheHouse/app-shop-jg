

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
//   const detalles = payload?.detalles || payload?.items || [];

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

//   // WhatsApp (igual que lo tenías)
//   const handleWhatsAppRedirect = () => {
//     const productosStr = (Array.isArray(detalles) ? detalles : [])
//       .map((item) => {
//         const nombre =
//           item?.producto_nombre || item?.producto?.nombre || "Producto";
//         return `%0A• ${nombre} (x${item?.cantidad ?? 1})`;
//       })
//       .join("");

//     const mensaje =
//       `¡Hola JG SHOP! 👋%0A%0A` +
//       `*NUEVO PEDIDO:* #${venta?.id || "S/N"}%0A` +
//       `*CLIENTE:* ${datosCliente.nombre} ${datosCliente.apellido}%0A` +
//       `*TOTAL:* ${formatARS(total_final)}%0A%0A` +
//       `*DETALLE:*${productosStr}%0A%0A` +
//       `Adjunto el comprobante de transferencia abajo:`;

//     window.open(`https://wa.me/5493534275476?text=${mensaje}`, "_blank");
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
//                 <h3 className="font-black italic uppercase text-xl text-white">
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

//                 <div className="mt-auto text-center">
//                   <div className="inline-block bg-white p-3 rounded-2xl shadow-lg border border-slate-100 mb-3">
//                     <img
//                       src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=julian.gomez.inf`}
//                       alt="QR"
//                       className="h-24 w-24"
//                     />
//                   </div>
//                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                     Escaneá para pagar
//                   </p>
//                 </div>
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
//               <h3 className="font-black italic uppercase text-[10px] tracking-[0.3em] text-indigo-500 mb-8 text-center">
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
//         <div className="mt-12 rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 md:p-12">
//           <h2 className="font-black italic uppercase text-xl mb-10 border-l-4 border-indigo-500 pl-4 text-white">
//             Tu Selección
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
//             {(Array.isArray(detalles) ? detalles : []).map((item, idx) => (
//               <div
//                 key={item?.id ?? `${item?.producto_id ?? "p"}-${idx}`}
//                 className="flex items-center gap-4 py-4 border-b border-slate-100 dark:border-white/5 last:border-0"
//               >
//                 <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
//                   <img
//                     // ✅ Si en detalles viene foto_url como path, lo armamos con API_URL.
//                     // ✅ Si no viene, usamos un placeholder que NO rompe DNS.
//                     src={getSafeUrl(item?.foto_url) || "https://placehold.co/100x100?text=JG"}
//                     alt={item?.producto_nombre || item?.producto?.nombre || "Producto"}
//                     className="h-full w-full object-cover"
//                     loading="lazy"
//                   />
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <h4 className="font-black italic uppercase text-[11px] truncate text-white">
//                     {item?.producto_nombre || item?.producto?.nombre || `Producto #${item?.producto_id ?? ""}`}
//                   </h4>
//                   <p className="text-[9px] text-indigo-500 font-bold uppercase italic">
//                     CANT: {item?.cantidad ?? 1}
//                   </p>
//                 </div>

//                 <div className="font-black italic text-sm text-white">
//                   {formatARS(item?.subtotal ?? item?.total ?? 0)}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ConfirmacionCompraPage;
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  CheckCircle2,
  ReceiptText,
  ArrowLeft,
  Copy,
  Check,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import ShopHeader from "../components/layout/ShopHeader.jsx";
import { getVentaByIdApi } from "../api/shopApi";

// ⚠️ Solo para armar URLs de imágenes si vienen como path relativo.
// Tu VITE_API_URL_BACKEND suele ser ".../shop". Acá le quitamos "/shop".
const API_URL =
  import.meta.env.VITE_API_URL_BACKEND?.replace("/shop", "") || "";

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

const ConfirmacionCompraPage = () => {
  const location = useLocation();
  const [remote, setRemote] = useState(null);
  const [loadingRemote, setLoadingRemote] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // ✅ Para evitar múltiples calls por re-renders (StrictMode / etc)
  const lastFetchedIdRef = useRef(null);

  // 1) Obtener ID de la venta de la URL
  const ventaIdFromQS = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const v = sp.get("venta_id");
    const n = v ? Number(v) : null;
    return Number.isFinite(n) ? n : null;
  }, [location.search]);

  /**
   * 2) API-FIRST SIEMPRE:
   * - Si hay venta_id => SIEMPRE fetch al backend.
   * - Aunque exista location.state, lo usamos solo como fallback visual mientras carga.
   */
  useEffect(() => {
    if (!ventaIdFromQS) return;

    // evita refetch del mismo id en re-renders
    if (lastFetchedIdRef.current === ventaIdFromQS) return;
    lastFetchedIdRef.current = ventaIdFromQS;

    setLoadingRemote(true);

    getVentaByIdApi(ventaIdFromQS)
      .then((res) => {
        // axios: resp?.data, pero tu helper ya retorna data o resp
        const data = res?.data ?? res;
        setRemote(data);
      })
      .catch((err) => {
        console.error("Error cargando venta desde API:", err);
        // si falla, liberamos el lock para permitir reintentar (por ejemplo, cambiando QS)
        lastFetchedIdRef.current = null;
      })
      .finally(() => setLoadingRemote(false));
  }, [ventaIdFromQS]);

  /**
   * 3) Payload:
   * Mientras remote llega, mostramos location.state para que no quede “vacío”.
   * Cuando llega remote, gana remote.
   */
  const payload = remote || location.state || null;

  // Si está cargando y NO hay nada que mostrar aún
  if (loadingRemote && !payload) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Si no hay venta_id o no hay payload
  if (!ventaIdFromQS && !payload) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
        <p className="text-slate-400">No encontramos información de tu pedido.</p>
        <Link
          to="/"
          className="text-indigo-400 underline uppercase text-xs font-bold tracking-widest"
        >
          Ir al inicio
        </Link>
      </div>
    );
  }

  if (!payload && !loadingRemote) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
        <p className="text-slate-400">No encontramos información de tu pedido.</p>
        <Link
          to="/"
          className="text-indigo-400 underline uppercase text-xs font-bold tracking-widest"
        >
          Ir al inicio
        </Link>
      </div>
    );
  }

  // --- NORMALIZACIÓN (sin cambiar tu UI, solo robustez) ---
  const venta = payload?.venta || payload;

  // ✅ puede venir en payload.detalles (como tu JSON), payload.items, o incluso venta.detalles
  const detalles =
    payload?.detalles ||
    payload?.items ||
    venta?.detalles ||
    [];

  const total_bruto =
    payload?.total_bruto ?? venta?.total_bruto ?? venta?.total ?? 0;
  const descuento = payload?.descuento ?? venta?.descuento ?? 0;
  const total_final =
    payload?.total_final ??
    venta?.total_final ??
    (Number(total_bruto || 0) - Number(descuento || 0));

  const datosCliente =
    venta?.cliente || {
      nombre: venta?.nombre || payload?.nombre || "Cliente",
      apellido: venta?.apellido || payload?.apellido || "",
    };

  
  const handleWhatsAppRedirect = () => {
  // 1. Validamos que tengamos detalles para no enviar un mensaje vacío
  const listaProductos = Array.isArray(detalles) ? detalles : [];
  
  // 2. Construimos el string de productos con limpieza de strings
  const productosTexto = listaProductos
    .map((item) => {
      const nombre = item?.producto_nombre || item?.producto?.nombre || "Producto";
      const cant = item?.cantidad ?? 1;
      return `• ${nombre} (x${cant})`;
    })
    .join("\n");

  // 3. Construimos el cuerpo del mensaje (usando saltos de línea naturales \n)
  const mensajeFormateado = 
    `¡Hola JG SHOP! 👋\n\n` +
    `*NUEVO PEDIDO:* #${venta?.id || "S/N"}\n` +
    `*CLIENTE:* ${datosCliente.nombre} ${datosCliente.apellido}\n` +
    `*TOTAL:* ${formatARS(total_final)}\n\n` +
    `*DETALLE:*\n${productosTexto}\n\n` +
    `Adjunto el comprobante de transferencia abajo:`;

  /**
   * 4. EL SECRETO: encodeURIComponent
   * Esto convierte automáticamente los emojis, espacios, asteriscos y el 
   * símbolo de pesos ($) a un formato que WhatsApp entiende perfectamente.
   */
  const mensajeFinal = encodeURIComponent(mensajeFormateado);

  window.open(`https://wa.me/5493534275476?text=${mensajeFinal}`, "_blank");
};
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <ShopHeader />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* HEADER ÉXITO */}
        <div className="text-center mb-16 animate-in fade-in zoom-in duration-500">
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald-500/30">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">
            Pedido Recibido
          </h1>
          <p className="text-slate-400 font-bold tracking-widest uppercase text-xs mt-2">
            JG SHOP OFFICIAL • ORDEN #{venta?.id}
            {loadingRemote ? " • actualizando..." : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* BLOQUE IZQUIERDO: PAGOS */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CARD TRANSFERENCIA */}
            <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 flex flex-col shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <ReceiptText className="h-6 w-6 text-indigo-500" />
                <h3 className="font-black italic uppercase text-xl text-white">
                  Transferencia
                </h3>
              </div>

              <div className="flex-1 space-y-6">
                <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="text-sm">
                    <p className="font-bold text-base">Julian Agustin Gomez</p>
                    <p className="text-xs text-slate-500 italic">
                      Brubank | CUIT 20-39173125-0
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        copyToClipboard("1430001713017789840017", "cbu")
                      }
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500 transition-colors group"
                    >
                      <span className="text-[10px] font-mono font-bold">
                        CBU: ...840017
                      </span>
                      {copiedField === "cbu" ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                      )}
                    </button>

                    <button
                      onClick={() => copyToClipboard("julian.gomez.inf", "alias")}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500 transition-colors group"
                    >
                      <span className="text-[10px] font-mono font-bold">
                        ALIAS: julian.gomez.inf
                      </span>
                      {copiedField === "alias" ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-auto text-center">
                  <div className="inline-block bg-white p-3 rounded-2xl shadow-lg border border-slate-100 mb-3">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=julian.gomez.inf`}
                      alt="QR"
                      className="h-24 w-24"
                    />
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Escaneá para pagar
                  </p>
                </div>
              </div>
            </div>

            {/* CARD WHATSAPP */}
            <div className="rounded-[2.5rem] bg-indigo-600 p-8 text-white flex flex-col shadow-xl shadow-indigo-500/20">
              <div className="flex items-center gap-3 mb-8">
                <ShoppingBag className="h-6 w-6" />
                <h3 className="font-black italic uppercase text-xl">Confirmar</h3>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-2xl font-black italic uppercase mb-4 leading-tight">
                    Acción Rápida
                  </h4>
                  <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-6">
                    Hola {datosCliente.nombre}, al presionar el botón enviaremos tu
                    pedido #{venta?.id} por WhatsApp para coordinar la entrega.
                  </p>
                </div>

                <div className="mt-auto">
                  <button
                    onClick={handleWhatsAppRedirect}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-6 text-sm font-black italic uppercase text-indigo-600 hover:bg-slate-50 transition-all active:scale-95 shadow-xl group"
                  >
                    Enviar Pedido
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ASIDE DERECHO: TOTALES */}
          <aside className="lg:col-span-1">
            <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 shadow-lg sticky top-8">
              <h3 className="font-black italic uppercase text-[10px] tracking-[0.3em] text-indigo-500 mb-8 text-center">
                Estado de Cuenta
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-xs font-bold uppercase italic">
                  <span className="text-slate-400">Subtotal</span>
                  <span>{formatARS(total_bruto)}</span>
                </div>

                {Number(descuento) > 0 && (
                  <div className="flex justify-between text-xs font-bold uppercase italic text-emerald-500">
                    <span>Bonificación</span>
                    <span>-{formatARS(descuento)}</span>
                  </div>
                )}

                <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col items-center">
                  <span className="text-[9px] font-black uppercase text-slate-400 mb-1 italic">
                    Total Final
                  </span>
                  <span className="text-5xl font-black italic text-indigo-600 dark:text-indigo-400 leading-none">
                    {formatARS(total_final)}
                  </span>
                </div>
              </div>

              <Link
                to="/"
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-200 dark:border-white/10 py-5 text-[10px] font-black italic uppercase hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-white"
              >
                <ArrowLeft className="h-3 w-3" /> Volver a la Tienda
              </Link>
            </div>
          </aside>
        </div>

        {/* DETALLE PRODUCTOS ABAJO */}
<section className="mt-12 rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-500">
  <div className="flex items-center justify-between mb-10">
    <h2 className="font-black italic uppercase text-2xl border-l-4 border-indigo-500 pl-4 text-slate-900 dark:text-white tracking-tight">
      Tu Selección
    </h2>
    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">
      {detalles.length} Artículos
    </span>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-2">
    {(Array.isArray(detalles) ? detalles : []).map((item, idx) => {
      const nombre = item?.producto_nombre || item?.producto?.nombre || `Producto #${item?.producto_id ?? ""}`;
      const img = item?.imagen_url || item?.foto_url || item?.producto?.imagen_url || item?.producto?.foto_url || null;
      const cantidad = Number(item?.cantidad ?? 1);
      const subtotal = item?.subtotal ?? (cantidad * Number(item?.precio_unitario ?? 0));

      return (
        <div
          key={item?.id ?? `${item?.producto_id ?? "p"}-${idx}`}
          className="group flex items-center gap-5 py-5 border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] px-2 -mx-2 rounded-2xl transition-all duration-300"
        >
          {/* Contenedor de Imagen con Ratio Fijo */}
          <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0 shadow-sm border border-slate-200/50 dark:border-white/5">
            <img
              src={getSafeUrl(img) || "https://placehold.co/100x100?text=JG"}
              alt={nombre}
              className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            {/* Overlay sutil en dark mode */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent hidden dark:block" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="font-black italic uppercase text-xs md:text-sm truncate text-slate-800 dark:text-slate-100 tracking-wide">
              {nombre}
            </h4>
            <div className="flex items-center gap-3">
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase italic bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">
                CANT: {cantidad}
              </p>
              {item?.precio_unitario && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase italic">
                  u. {formatARS(item.precio_unitario)}
                </span>
              )}
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="font-black italic text-base text-slate-900 dark:text-white">
              {formatARS(subtotal)}
            </span>
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Subtotal</span>
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
