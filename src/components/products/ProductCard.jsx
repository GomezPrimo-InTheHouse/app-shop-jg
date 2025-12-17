
// import React from "react";
// import { Link } from "react-router-dom";
// import { ShoppingBag } from "lucide-react";

// const ProductCard = ({ product }) => {
//   const formatPrice = (value) =>
//     Number(value || 0).toLocaleString("es-AR", {
//       style: "currency",
//       currency: "ARS",
//       maximumFractionDigits: 0,
//     });

//   const formattedPrice = formatPrice(product.precio);

//   const hasOffer = product.oferta && product.oferta > 0;

//   let formattedOldPrice = null;
//   if (hasOffer) {
//     // product.oferta es porcentaje (ej 10 => 10%)
//     const originalPrice = product.precio / (1 - product.oferta / 100);
//     formattedOldPrice = formatPrice(originalPrice);
//   }

//   const handleImageError = (e) => {
//     e.target.src =
//       "https://via.placeholder.com/400x300/F3F4F6/6B7280?text=Sin+Imagen+JG";
//     e.target.className += " opacity-60";
//   };

//   return (
//     <article
//       className="group flex flex-col gap-3 rounded-xl border border-gray-200 
//                  bg-white/95 shadow-md p-4
//                  hover:shadow-lg hover:bg-white
//                  dark:bg-gray-900 dark:border-gray-700 
//                  dark:hover:bg-gray-800 dark:hover:shadow-2xl dark:hover:shadow-indigo-900/40
//                  transition-all duration-300"
//     >
//       {/* Imagen + Etiquetas */}
//       <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
//         <img
//           src={product.foto_url}
//           alt={product.nombre}
//           onError={handleImageError}
//           className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//           loading="lazy"
//         />

//         {hasOffer && (
//           <span
//             className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full 
//                        bg-indigo-700/95 px-3 py-1 shadow-lg
//                        border border-indigo-400/60"
//           >
//             <span className="text-xs font-extrabold text-yellow-300">
//               -{product.oferta}%
//             </span>
//             <span className="text-[10px] font-semibold tracking-wide text-white uppercase">
//               OFF
//             </span>
//           </span>
//         )}
//       </div>

//       {/* Contenido principal */}
//       <div className="flex flex-1 flex-col justify-between">
//         {/* Nombre */}
//         <h3
//           title={product.nombre}
//           className="mb-2 line-clamp-2 text-base font-semibold 
//                      text-gray-900 dark:text-gray-100
//                      group-hover:text-indigo-600 dark:group-hover:text-indigo-400
//                      transition-colors"
//         >
//           {product.nombre}
//         </h3>

//         {/* Descripción corta */}
//         <p className="flex-grow text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
//           {product.descripcion || "Producto de alta calidad y rendimiento."}
//         </p>

//         {/* Categoría */}
//         {product.categoria && (
//           <div className="mt-2 text-[10px] text-gray-600 dark:text-gray-400">
//             <span
//               className="inline-block rounded-full border border-gray-200 dark:border-gray-600 
//                          bg-gray-50 px-2 py-0.5 
//                          dark:bg-gray-800/80"
//             >
//               {product.categoria}
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Precio + CTA */}
//       <div className="mt-3 flex flex-col gap-1 border-t border-gray-100 pt-3 dark:border-gray-700">
//         {/* ✅ Precios (FIX mobile: no se desfasa ni se sale de la card) */}
//         <div className="min-w-0">
//           <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 min-w-0">
//             <span
//               className="whitespace-nowrap text-xl sm:text-2xl font-extrabold 
//                          text-indigo-600 dark:text-indigo-400 leading-none tabular-nums"
//             >
//               {formattedPrice}
//             </span>

//             {hasOffer && formattedOldPrice && (
//               <span className="whitespace-nowrap text-xs sm:text-sm font-medium line-through text-gray-400 dark:text-gray-500 leading-none tabular-nums">
//                 {formattedOldPrice}
//               </span>
//             )}

//             {/* Badge extra opcional (queda prolijo en mobile). Si no lo querés, lo borrás. */}
//             {hasOffer && (
//               <span
//                 className="whitespace-nowrap text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full
//                            bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
//               >
//                 Ahorrás {product.oferta}%
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Botón CTA */}
//         <Link
//           to={`/producto/${product.id}`}
//           state={{ product }}
//           className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg 
//                      px-4 py-2 text-sm font-semibold
//                      bg-indigo-600 text-white shadow-md 
//                      hover:bg-indigo-700 hover:shadow-lg
//                      dark:bg-indigo-500 dark:hover:bg-indigo-600
//                      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1
//                      dark:focus:ring-offset-gray-900
//                      transition-colors duration-200"
//         >
//           <ShoppingBag className="h-4 w-4" />
//           Ver detalle
//         </Link>
//       </div>
//     </article>
//   );
// };

// export default ProductCard;

import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Loader2 } from "lucide-react";
import { useFavorites } from "../../context/FavoriteContext.jsx"; // ✅ ajustá si tu estructura es distinta

const ProductCard = ({ product }) => {
  const { isFavorite, toggleFavorite, pendingById } = useFavorites();

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });

  // ✅ precio_final ?? precio
  const displayPrice =
    Number(product?.precio_final) > 0 ? product.precio_final : product.precio;

  const formattedPrice = formatPrice(displayPrice);

  const offerPct = Number(product?.oferta);
  const hasOffer = Number.isFinite(offerPct) && offerPct > 0;

  let formattedOldPrice = null;
  if (hasOffer && offerPct < 100 && Number(displayPrice) > 0) {
    // Si displayPrice es el precio final (con descuento), calculamos el "precio original"
    const originalPrice = Number(displayPrice) / (1 - offerPct / 100);
    formattedOldPrice = formatPrice(originalPrice);
  }

  const fav = isFavorite?.(product?.id);
  const pending = !!pendingById?.[product?.id];

  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/400x300/F3F4F6/6B7280?text=Sin+Imagen+JG";
    e.target.className += " opacity-60";
  };

  return (
    <article
      className="group flex flex-col gap-3 rounded-xl border border-gray-200 
                 bg-white/95 shadow-md p-4
                 hover:shadow-lg hover:bg-white
                 dark:bg-gray-900 dark:border-gray-700 
                 dark:hover:bg-gray-800 dark:hover:shadow-2xl dark:hover:shadow-indigo-900/40
                 transition-all duration-300"
    >
      {/* Imagen + Etiquetas */}
      <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        <img
          src={product.foto_url}
          alt={product.nombre}
          onError={handleImageError}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* ❤️ Favorito (overlay top-right) */}
        <button
          type="button"
          onClick={(e) => {
            // evita que el click se convierta en navegación/acciones del contenedor
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product); // pasamos el producto para que Mis Favoritos se actualice sin refetch
          }}
          aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="absolute top-2 right-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full
                     bg-white/90 backdrop-blur border border-gray-200 shadow
                     hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500
                     dark:bg-gray-900/70 dark:border-gray-700"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-300" />
          ) : (
            <Heart
              className={`h-4 w-4 transition ${
                fav
                  ? "text-rose-600 fill-rose-600"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            />
          )}
        </button>

        {hasOffer && (
          <span
            className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full 
                       bg-indigo-700/95 px-3 py-1 shadow-lg
                       border border-indigo-400/60"
          >
            <span className="text-xs font-extrabold text-yellow-300">
              -{offerPct}%
            </span>
            <span className="text-[10px] font-semibold tracking-wide text-white uppercase">
              OFF
            </span>
          </span>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col justify-between">
        {/* Nombre */}
        <h3
          title={product.nombre}
          className="mb-2 line-clamp-2 text-base font-semibold 
                     text-gray-900 dark:text-gray-100
                     group-hover:text-indigo-600 dark:group-hover:text-indigo-400
                     transition-colors"
        >
          {product.nombre}
        </h3>

        {/* Descripción corta */}
        <p className="flex-grow text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
          {product.descripcion || "Producto de alta calidad y rendimiento."}
        </p>

        {/* Categoría */}
        {product.categoria && (
          <div className="mt-2 text-[10px] text-gray-600 dark:text-gray-400">
            <span
              className="inline-block rounded-full border border-gray-200 dark:border-gray-600 
                         bg-gray-50 px-2 py-0.5 
                         dark:bg-gray-800/80"
            >
              {product.categoria}
            </span>
          </div>
        )}
      </div>

      {/* Precio + CTA */}
      <div className="mt-3 flex flex-col gap-1 border-t border-gray-100 pt-3 dark:border-gray-700">
        {/* ✅ Precios (mobile ok) */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 min-w-0">
            <span
              className="whitespace-nowrap text-xl sm:text-2xl font-extrabold 
                         text-indigo-600 dark:text-indigo-400 leading-none tabular-nums"
            >
              {formattedPrice}
            </span>

            {hasOffer && formattedOldPrice && (
              <span className="whitespace-nowrap text-xs sm:text-sm font-medium line-through text-gray-400 dark:text-gray-500 leading-none tabular-nums">
                {formattedOldPrice}
              </span>
            )}

            {hasOffer && (
              <span
                className="whitespace-nowrap text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full
                           bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
              >
                Ahorrás {offerPct}%
              </span>
            )}
          </div>
        </div>

        {/* Botón CTA */}
        <Link
          to={`/producto/${product.id}`}
          state={{ product }}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg 
                     px-4 py-2 text-sm font-semibold
                     bg-indigo-600 text-white shadow-md 
                     hover:bg-indigo-700 hover:shadow-lg
                     dark:bg-indigo-500 dark:hover:bg-indigo-600
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1
                     dark:focus:ring-offset-gray-900
                     transition-colors duration-200"
        >
          <ShoppingBag className="h-4 w-4" />
          Ver detalle
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
