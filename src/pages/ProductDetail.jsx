
// import { useEffect, useState } from "react";
// import { useLocation, useParams, Link } from "react-router-dom";
// import { fetchProductos } from "../api/productsApi.js";
// import StatusNotification from "../components/notification/StatusNotification.jsx";
// import ShopHeader from "../components/layout/ShopHeader.jsx";
// import { useCart } from "../context/CartContext.jsx";
// import { useAuth } from "../context/AuthContext.jsx";
// import { registrarVisualizacionApi } from "../api/shopApi.js";
// import { Heart, Loader2 } from "lucide-react";
// import { useFavorites } from "../context/FavoriteContext.jsx"; // ✅ ajustá si hace falta

// const ProductDetail = () => {
//   const { id } = useParams();
//   const location = useLocation();
//   const productFromState = location.state?.product || null;

//   const { cliente, sesionId } = useAuth();
//   const { isFavorite, toggleFavorite, pendingById } = useFavorites();

//   const [product, setProduct] = useState(productFromState);
//   const [loading, setLoading] = useState(!productFromState);
//   const [error, setError] = useState("");

//   const { addToCart, openCart } = useCart();

//   // Cargar producto si entro por URL directa
//   useEffect(() => {
//     const loadProduct = async () => {
//       if (productFromState) return;

//       try {
//         setLoading(true);
//         setError("");

//         const data = await fetchProductos();
//         const found = data.find((p) => p.id === Number(id) && p.subir_web);

//         if (!found) {
//           setError("No encontramos este producto en la tienda web.");
//         } else {
//           setProduct(found);
//         }
//       } catch (err) {
//         console.error(err);
//         setError(
//           "No pudimos obtener la información del producto. Probá recargar la página."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProduct();
//   }, [id, productFromState]);

//   // registrar visualización
//   useEffect(() => {
//     if (!product) return;

//     registrarVisualizacionApi({
//       producto_id: product.id,
//       cliente_id: cliente?.id || null,
//       sesion_cliente_id: sesionId || null,
//       origen: "web_shop",
//     }).catch((err) => {
//       console.error("Error registrando visualización", err);
//     });
//   }, [product, cliente?.id, sesionId]);

//   const handleImageError = (e) => {
//     e.target.src =
//       "https://via.placeholder.com/600x600/F3F4F6/6B7280?text=Sin+imagen+JG";
//   };

//   const handleWhatsApp = () => {
//     if (!product) return;

//     const displayPrice =
//       Number(product?.precio_final) > 0 ? product.precio_final : product.precio;

//     const formatted = Number(displayPrice).toLocaleString("es-AR", {
//       style: "currency",
//       currency: "ARS",
//       maximumFractionDigits: 0,
//     });

//     const msg = `Hola! Vi este producto en la tienda web y quiero más info:\n\n${product.nombre} - ${formatted}`;
//     const url = `https://wa.me/5493534275476?text=${encodeURIComponent(msg)}`;
//     window.open(url, "_blank");
//   };

//   const handleAddToCart = () => {
//     if (!product) return;
//     addToCart(product, 1);
//     openCart?.();
//   };

//   const BaseLayout = ({ children }) => (
//     <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
//       <ShopHeader />
//       {children}
//     </div>
//   );

//   if (loading) {
//     return (
//       <BaseLayout>
//         <main className="flex h-[60vh] items-center justify-center px-4">
//           <StatusNotification
//             variant="loading"
//             message="Cargando información del producto..."
//             showSpinner
//           />
//         </main>
//       </BaseLayout>
//     );
//   }

//   if (error || !product) {
//     return (
//       <BaseLayout>
//         <main className="flex h-[60vh] items-center justify-center px-4">
//           <StatusNotification
//             variant="error"
//             message={error || "Producto no encontrado."}
//           />
//         </main>
//       </BaseLayout>
//     );
//   }

//   // ✅ precio_final ?? precio
//   const displayPrice =
//     Number(product?.precio_final) > 0 ? product.precio_final : product.precio;

//   const formattedPrice = Number(displayPrice).toLocaleString("es-AR", {
//     style: "currency",
//     currency: "ARS",
//     maximumFractionDigits: 0,
//   });

//   const offerPct = Number(product?.oferta);
//   const hasOffer = Number.isFinite(offerPct) && offerPct > 0;

//   const originalPrice =
//     hasOffer && offerPct < 100 && Number(displayPrice) > 0
//       ? Number(displayPrice) / (1 - offerPct / 100)
//       : null;

//   const shortDescription = product.descripcion;
//   const longDescription = product.descripcion_web;

//   const fav = isFavorite?.(product?.id);
//   const pending = !!pendingById?.[product?.id];

//   return (
//     <BaseLayout>
//       <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
//         <section
//           className="grid grid-cols-1 gap-8 rounded-2xl border 
//                      border-slate-200 bg-white/95 p-4 shadow-lg
//                      sm:p-6 lg:grid-cols-[1.15fr,1fr]
//                      dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-2xl"
//         >
//           {/* Imagen */}
//           <div className="w-full">
//             <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-900">
//               <img
//                 src={product.foto_url}
//                 alt={product.nombre}
//                 onError={handleImageError}
//                 className="h-full w-full object-cover"
//               />

//               {/* ❤️ Favorito overlay */}
//               <button
//                 type="button"
//                 onClick={() => toggleFavorite(product)}
//                 aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
//                 className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full
//                            bg-white/90 backdrop-blur border border-slate-200 shadow
//                            hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500
//                            dark:bg-slate-950/60 dark:border-slate-700"
//               >
//                 {pending ? (
//                   <Loader2 className="h-5 w-5 animate-spin text-indigo-600 dark:text-indigo-300" />
//                 ) : (
//                   <Heart
//                     className={`h-5 w-5 transition ${
//                       fav
//                         ? "text-rose-600 fill-rose-600"
//                         : "text-slate-700 dark:text-slate-200"
//                     }`}
//                   />
//                 )}
//               </button>

//               {hasOffer && (
//                 <span
//                   className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full 
//                              border border-indigo-400/70 bg-indigo-700/95 px-3 py-1 shadow-lg"
//                 >
//                   <span className="text-xs font-extrabold text-yellow-300">
//                     -{offerPct}%
//                   </span>
//                   <span className="text-[10px] font-semibold uppercase tracking-wide text-white">
//                     OFF
//                   </span>
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Info */}
//           <div className="flex flex-col gap-4">
//             <h1 className="text-xl font-semibold sm:text-2xl">{product.nombre}</h1>

//             {shortDescription && (
//               <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
//                 {shortDescription}
//               </p>
//             )}

//             <div className="mt-1 flex flex-wrap items-center gap-2">
//               {product.categoria && (
//                 <span
//                   className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs sm:text-sm
//                              text-slate-700
//                              dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
//                 >
//                   {product.categoria}
//                 </span>
//               )}

//               {hasOffer && (
//                 <span className="rounded-full border border-amber-500/70 bg-amber-500/10 px-3 py-1 text-xs sm:text-sm text-amber-500 dark:text-amber-300">
//                   Oferta especial
//                 </span>
//               )}
//             </div>

//             {/* Precios */}
//             <div className="mt-3 flex items-baseline gap-3">
//               <span className="text-2xl font-extrabold text-indigo-600 sm:text-3xl dark:text-indigo-400">
//                 {formattedPrice}
//               </span>
//               {originalPrice && (
//                 <span className="text-xs font-medium text-slate-400 line-through dark:text-slate-500">
//                   {Number(originalPrice).toLocaleString("es-AR", {
//                     style: "currency",
//                     currency: "ARS",
//                     maximumFractionDigits: 0,
//                   })}
//                 </span>
//               )}
//             </div>

//             {longDescription && (
//               <section className="mt-4 space-y-2">
//                 <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
//                   Detalle del producto
//                 </h3>
//                 <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
//                   {longDescription}
//                 </p>
//               </section>
//             )}

//             {/* Botones */}
//             <div className="mt-6 flex flex-col gap-3 sm:flex-row">
//               <button
//                 onClick={handleAddToCart}
//                 className="flex-1 rounded-full bg-indigo-600 px-4 py-2 text-sm sm:text-base font-semibold 
//                            text-white shadow-md hover:bg-indigo-700 hover:shadow-lg
//                            focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1
//                            focus:ring-offset-slate-100 dark:focus:ring-offset-slate-950
//                            transition-colors"
//               >
//                 Agregar al carrito
//               </button>

//               <button
//                 onClick={handleWhatsApp}
//                 className="flex-1 rounded-full border border-green-500 px-4 py-2 text-sm sm:text-base font-semibold
//                            text-green-600 hover:bg-green-500/10
//                            dark:border-green-400 dark:text-green-300 dark:hover:bg-green-500/10
//                            focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1
//                            focus:ring-offset-slate-100 dark:focus:ring-offset-slate-950
//                            transition-colors"
//               >
//                 Consultar por WhatsApp
//               </button>
//             </div>

//             <div className="mt-2">
//               <Link
//                 to="/"
//                 className="text-xs text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
//               >
//                 ← Volver a productos
//               </Link>
//             </div>
//           </div>
//         </section>

//         {/* <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
//           <p>
//             ⚡ Este producto está disponible para venta en el local. Los precios pueden variar según stock y
//             promociones. Te recomendamos consultar disponibilidad por WhatsApp antes de realizar tu compra.
//           </p>
//         </div> */}
//       </main>
//     </BaseLayout>
//   );
// };

// export default ProductDetail;


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