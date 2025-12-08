import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { fetchProductos } from "../api/productsApi.js";
import StatusNotification from "../components/notification/StatusNotification.jsx";
import ShopHeader from "../components/layout/ShopHeader.jsx";
import { useCart } from "../context/CartContext.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const productFromState = location.state?.product || null;

  const [product, setProduct] = useState(productFromState);
  const [loading, setLoading] = useState(!productFromState);
  const [error, setError] = useState("");

  const { addItem, openCart } = useCart();

  // Cargar producto si entro por URL directa
  useEffect(() => {
    const loadProduct = async () => {
      if (productFromState) return;

      try {
        setLoading(true);
        setError("");

        const data = await fetchProductos();
        const found = data.find(
          (p) => p.id === Number(id) && p.subir_web
        );

        if (!found) {
          setError("No encontramos este producto en la tienda web.");
        } else {
          setProduct(found);
        }
      } catch (err) {
        console.error(err);
        setError(
          "No pudimos obtener la información del producto. Probá recargar la página."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, productFromState]);

  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/600x600/F3F4F6/6B7280?text=Sin+imagen+JG";
  };

  const handleWhatsApp = () => {
    if (!product) return;

    const formattedPrice = product.precio.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });

    const msg = `Hola! Vi este producto en la tienda web y quiero más info:\n\n${product.nombre} - ${formattedPrice}`;
    const url = `https://wa.me/5493525660000?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product);
    openCart();
  };

  const BaseLayout = ({ children }) => (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <ShopHeader />
      {children}
    </div>
  );

  // Estados de carga / error
  if (loading) {
    return (
      <BaseLayout>
        <main className="flex h-[60vh] items-center justify-center px-4">
          <StatusNotification
            variant="loading"
            message="Cargando información del producto..."
            showSpinner
          />
        </main>
      </BaseLayout>
    );
  }

  if (error || !product) {
    return (
      <BaseLayout>
        <main className="flex h-[60vh] items-center justify-center px-4">
          <StatusNotification
            variant="error"
            message={error || "Producto no encontrado."}
          />
        </main>
      </BaseLayout>
    );
  }

  // Datos calculados
  const formattedPrice = product.precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

  const hasOffer = product.oferta && product.oferta > 0;
  const originalPrice =
    hasOffer && product.oferta > 0
      ? product.precio / (1 - product.oferta / 100)
      : null;

  const shortDescription = product.descripcion;       // intro corta
  const longDescription = product.descripcion_web;    // detalle largo solo aquí

  return (
    <BaseLayout>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        {/* Card principal */}
        <section
          className="grid grid-cols-1 gap-8 rounded-2xl border 
                     border-slate-200 bg-white/95 p-4 shadow-lg
                     sm:p-6 lg:grid-cols-[1.15fr,1fr]
                     dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-2xl"
        >
          {/* Imagen */}
          <div className="w-full">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-900">
              <img
                src={product.foto_url}
                alt={product.nombre}
                onError={handleImageError}
                className="h-full w-full object-cover"
              />

              {hasOffer && (
                <span
                  className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full 
                             border border-indigo-400/70 bg-indigo-700/95 px-3 py-1 shadow-lg"
                >
                  <span className="text-xs font-extrabold text-yellow-300">
                    -{product.oferta}%
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-white">
                    OFF
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            {/* Nombre */}
            <h1 className="text-xl font-semibold sm:text-2xl">
              {product.nombre}
            </h1>

            {/* Descripción corta */}
            {shortDescription && (
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                {shortDescription}
              </p>
            )}

            {/* Chips */}
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {product.categoria && (
                <span
                  className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs sm:text-sm
                             text-slate-700
                             dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                >
                  {product.categoria}
                </span>
              )}

              {hasOffer && (
                <span className="rounded-full border border-amber-500/70 bg-amber-500/10 px-3 py-1 text-xs sm:text-sm text-amber-500 dark:text-amber-300">
                  Oferta especial
                </span>
              )}
            </div>

            {/* Precios */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-indigo-600 sm:text-3xl dark:text-indigo-400">
                {formattedPrice}
              </span>
              {originalPrice && (
                <span className="text-xs font-medium text-slate-400 line-through dark:text-slate-500">
                  {originalPrice.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0,
                  })}
                </span>
              )}
            </div>

            {/* Descripción larga */}
            {longDescription && (
              <section className="mt-4 space-y-2">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Detalle del producto
                </h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {longDescription}
                </p>
              </section>
            )}

            {/* Botones */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                className="flex-1 rounded-full bg-indigo-600 px-4 py-2 text-sm sm:text-base font-semibold 
                           text-white shadow-md hover:bg-indigo-700 hover:shadow-lg
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1
                           focus:ring-offset-slate-100 dark:focus:ring-offset-slate-950
                           transition-colors"
              >
                Agregar al carrito
              </button>

              <button
                onClick={handleWhatsApp}
                className="flex-1 rounded-full border border-green-500 px-4 py-2 text-sm sm:text-base font-semibold
                           text-green-600 hover:bg-green-500/10
                           dark:border-green-400 dark:text-green-300 dark:hover:bg-green-500/10
                           focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1
                           focus:ring-offset-slate-100 dark:focus:ring-offset-slate-950
                           transition-colors"
              >
                Consultar por WhatsApp
              </button>
            </div>

            {/* Link volver */}
            <div className="mt-2">
              <Link
                to="/"
                className="text-xs text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
              >
                ← Volver a productos
              </Link>
            </div>
          </div>
        </section>

        {/* Nota inferior */}
        <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <p>
            ⚡ Este producto está disponible para venta en el local. Los precios pueden variar según stock y
            promociones. Te recomendamos consultar disponibilidad por WhatsApp antes de realizar tu compra.
          </p>
        </div>
      </main>
    </BaseLayout>
  );
};

export default ProductDetail;
