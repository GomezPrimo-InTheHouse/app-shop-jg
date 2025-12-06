import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const formattedPrice = product.precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

  const hasOffer = product.oferta && product.oferta > 0;

  const handleImageError = (e) => {
    // Fallback sencillo si la foto falla
    e.target.src =
      "https://via.placeholder.com/400x300?text=Sin+imagen";
  };

  return (
    <article
      className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 
                 flex flex-col gap-3 hover:border-neutral-500 hover:bg-neutral-900
                 transition-colors"
    >
      {/* Imagen */}
      <div className="relative mb-2">
        <img
          src={product.foto_url}
          alt={product.nombre}
          onError={handleImageError}
          className="aspect-[4/3] w-full rounded-xl object-cover bg-neutral-800"
        />

        {hasOffer && (
          <span className="absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] font-semibold bg-amber-500 text-neutral-900">
            {product.oferta}% OFF
          </span>
        )}
      </div>

      {/* Nombre */}
      <h3 className="font-medium text-sm sm:text-base line-clamp-2">
        {product.nombre}
      </h3>

      {/* Descripción */}
      <p className="text-xs text-neutral-400 line-clamp-2">
        {product.descripcion || "Sin descripción"}
      </p>

      {/* Categoría / etiqueta */}
      <div className="flex items-center justify-between text-[11px] text-neutral-400">
        {product.categoria && (
          <span className="px-2 py-0.5 rounded-full border border-neutral-700">
            {product.categoria}
          </span>
        )}
      </div>

      {/* Precio + botón */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800">
        <span className="font-semibold text-sm sm:text-base">
          {formattedPrice}
        </span>

        <Link
          to={`/producto/${product.id}`}
          state={{ product }} // se lo pasamos al detalle para no re-fetch
          className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-neutral-600 
                     hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
        >
          Ver detalle
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
