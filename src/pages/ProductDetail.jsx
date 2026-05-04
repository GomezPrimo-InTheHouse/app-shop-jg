
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


import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { fetchProductos } from "../api/productsApi.js";
import StatusNotification from "../components/notification/StatusNotification.jsx";
import ShopHeader from "../components/layout/ShopHeader.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { registrarVisualizacionApi } from "../api/shopApi.js";
import { Heart, Loader2, Share2, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { useFavorites } from "../context/FavoriteContext.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const productFromState = location.state?.product || null;

  const { cliente, sesionId } = useAuth();
  const { isFavorite, toggleFavorite, pendingById } = useFavorites();

  const [product, setProduct] = useState(productFromState);
  const [loading, setLoading] = useState(!productFromState);
  const [error, setError] = useState("");
  const [shared, setShared] = useState(false);
  const [added, setAdded] = useState(false);

  const { addToCart, openCart } = useCart();

  useEffect(() => {
    if (productFromState) {
      setProduct(productFromState);
      setLoading(false);
      return;
    }
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProductos();
        const found = data.find(
          (p) => String(p.id) === String(id) && p.subir_web
        );
        if (!found) setError("No encontramos este producto en la tienda web.");
        else setProduct(found);
      } catch (err) {
        console.error(err);
        setError("No pudimos obtener la información del producto. Probá recargar la página.");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    registrarVisualizacionApi({
      producto_id: product.id,
      cliente_id: cliente?.id || null,
      sesion_cliente_id: sesionId || null,
      origen: "web_shop",
    }).catch(console.error);
  }, [product?.id]);

  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/600x600/F3F4F6/6B7280?text=Sin+imagen+JG";
  };

  const handleConsultarWhatsApp = () => {
    if (!product) return;
    const displayPrice =
      Number(product?.precio_final) > 0 ? product.precio_final : product.precio;
    const formatted = Number(displayPrice).toLocaleString("es-AR", {
      style: "currency", currency: "ARS", maximumFractionDigits: 0,
    });
    const msg = `Hola! Vi este producto en la tienda web y quiero más info:\n\n*${product.nombre}* - ${formatted}`;
    window.open(`https://wa.me/5493534275476?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleCompartirWhatsApp = () => {
    if (!product) return;
    const productUrl = `${window.location.origin}/producto/${product.id}`;
    const displayPrice =
      Number(product?.precio_final) > 0 ? product.precio_final : product.precio;
    const formatted = Number(displayPrice).toLocaleString("es-AR", {
      style: "currency", currency: "ARS", maximumFractionDigits: 0,
    });
    const msg =
      `¡Mirá este producto de JG Informática! 🛒\n\n` +
      `*${product.nombre}*\n💰 ${formatted}\n\n🔗 ${productUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, 1);
    openCart?.();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Convierte texto con saltos de línea en array de líneas no vacías
  const parseDescripcionLineas = (texto) => {
    if (!texto) return [];
    return texto
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
  };

  const BaseLayout = ({ children }) => (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <ShopHeader />
      {children}
    </div>
  );

  if (loading) {
    return (
      <BaseLayout>
        <main className="flex h-[60vh] items-center justify-center px-4">
          <StatusNotification variant="loading" message="Cargando producto..." showSpinner />
        </main>
      </BaseLayout>
    );
  }

  if (error || !product) {
    return (
      <BaseLayout>
        <main className="flex h-[60vh] items-center justify-center px-4">
          <StatusNotification variant="error" message={error || "Producto no encontrado."} />
        </main>
      </BaseLayout>
    );
  }

  const displayPrice =
    Number(product?.precio_final) > 0 ? product.precio_final : product.precio;

  const formattedPrice = Number(displayPrice).toLocaleString("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0,
  });

  const offerPct = Number(product?.oferta);
  const hasOffer = Number.isFinite(offerPct) && offerPct > 0;

  const originalPrice =
    hasOffer && offerPct < 100 && Number(displayPrice) > 0
      ? Number(displayPrice) / (1 - offerPct / 100)
      : null;

  const fav = isFavorite?.(product?.id);
  const pending = !!pendingById?.[product?.id];

  // Descripción larga parseada como lista
  const lineasDetalle = parseDescripcionLineas(product.descripcion_web);

  return (
    <BaseLayout>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-10">

        {/* Volver */}
        <Link
          to="/"
          className="mb-5 inline-flex items-center gap-1.5 text-xs text-slate-400
                     hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a productos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl
                        border border-slate-200 dark:border-slate-800
                        bg-white dark:bg-slate-900 shadow-sm">

          {/* ── COLUMNA IMAGEN ── */}
          <div className="relative flex items-center justify-center
                          bg-white dark:bg-slate-800
                          min-h-[320px] lg:min-h-[520px]
                          border-b lg:border-b-0 lg:border-r
                          border-slate-100 dark:border-slate-700">

            {/* Imagen centrada, sin recorte */}
            <img
              src={product.foto_url}
              alt={product.nombre}
              onError={handleImageError}
              className="w-full h-full object-contain p-6
                         max-h-[420px] lg:max-h-[520px]"
            />

            {/* Badge oferta */}
            {hasOffer && (
              <span className="absolute left-4 top-4 rounded-full
                               bg-slate-900 dark:bg-white
                               px-3 py-1 shadow-md">
                <span className="text-xs font-semibold
                                 text-white dark:text-slate-900">
                  -{offerPct}% OFF
                </span>
              </span>
            )}

            {/* Favorito */}
            <button
              type="button"
              onClick={() => toggleFavorite(product)}
              aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center
                         justify-center rounded-full
                         border border-slate-200 dark:border-slate-600
                         bg-white/95 dark:bg-slate-900/80
                         shadow-sm backdrop-blur-sm
                         hover:bg-white dark:hover:bg-slate-900 transition"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              ) : (
                <Heart
                  className={`h-4 w-4 transition ${
                    fav ? "fill-rose-500 text-rose-500" : "text-slate-400"
                  }`}
                />
              )}
            </button>
          </div>

          {/* ── COLUMNA INFO ── */}
          <div className="flex flex-col p-6 sm:p-8 gap-5">

            {/* Categoría */}
            {product.categoria && (
              <p className="text-[11px] font-semibold uppercase tracking-widest
                            text-slate-400 dark:text-slate-500">
                {product.categoria}
              </p>
            )}

            {/* Nombre */}
            <h1 className="text-xl sm:text-2xl font-semibold leading-snug
                           text-slate-900 dark:text-slate-50">
              {product.nombre}
            </h1>

            {/* Descripción corta */}
            {product.descripcion && (
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {product.descripcion}
              </p>
            )}

            {/* Precio */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {formattedPrice}
              </span>
              {originalPrice && (
                <span className="text-sm text-slate-400 line-through dark:text-slate-500">
                  {Number(originalPrice).toLocaleString("es-AR", {
                    style: "currency", currency: "ARS", maximumFractionDigits: 0,
                  })}
                </span>
              )}
            </div>

            {/* ── Descripción larga como lista ── */}
            {lineasDetalle.length > 0 && (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest
                              text-slate-400 dark:text-slate-500">
                  Características
                </p>
                <ul className="space-y-2">
                  {lineasDetalle.map((linea, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      {/* Bullet check minimalista */}
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center
                                       justify-center rounded-full
                                       bg-slate-100 dark:bg-slate-800">
                        <Check className="h-2.5 w-2.5 text-slate-500 dark:text-slate-400" />
                      </span>
                      <span className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {linea}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Botones ── */}
            <div className="mt-auto pt-4 flex flex-col gap-3">

              {/* Primario */}
              <button
                onClick={handleAddToCart}
                className={`flex w-full items-center justify-center gap-2
                            rounded-xl px-5 py-3 text-sm font-medium transition
                            active:scale-[0.98]
                            ${added
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-900 hover:bg-slate-700 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                            }`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" />
                    Agregado al carrito
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Agregar al carrito
                  </>
                )}
              </button>

              {/* Secundarios */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleConsultarWhatsApp}
                  className="flex items-center justify-center gap-2 rounded-xl
                             bg-[#25D366] hover:bg-[#1ebe5d]
                             px-4 py-2.5 text-sm font-medium text-white
                             transition active:scale-[0.98]"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Consultar
                </button>

                <button
                  onClick={handleCompartirWhatsApp}
                  className={`flex items-center justify-center gap-2 rounded-xl border
                              px-4 py-2.5 text-sm font-medium transition active:scale-[0.98]
                              ${shared
                                ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-transparent dark:text-slate-400 dark:hover:bg-slate-800"
                              }`}
                >
                  <Share2 className="h-4 w-4 shrink-0" />
                  {shared ? "¡Enviado!" : "Compartir"}
                </button>
              </div>

              {/* Hint */}
              <p className="text-center text-xs text-slate-400 dark:text-slate-600">
                <span className="font-medium text-[#25D366]">Consultar</span> escribe al local ·{" "}
                <span className="font-medium text-slate-500 dark:text-slate-400">Compartir</span> envía el link
              </p>
            </div>
          </div>
        </div>
      </main>
    </BaseLayout>
  );
};

export default ProductDetail;