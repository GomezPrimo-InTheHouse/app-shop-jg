import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchProductos } from "../api/productsApi.js";
import StatusNotification from "../components/notification/StatusNotification.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const productFromState = location.state?.product || null;

  const [product, setProduct] = useState(productFromState);
  const [loading, setLoading] = useState(!productFromState);
  const [error, setError] = useState("");

  // Si no viene por state (ej: URL directa), buscamos en la API
  useEffect(() => {
    const loadProduct = async () => {
      if (productFromState) return;

      try {
        setLoading(true);
        setError("");

        const data = await fetchProductos();
        const found = data.find((p) => p.id === Number(id) && p.subir_web);

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
      "https://via.placeholder.com/600x600?text=Sin+imagen";
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

  if (loading) {
    return (
      <div className="min-h-screen 
                  bg-neutral-50 text-neutral-900
                  dark:bg-neutral-950 dark:text-neutral-100
                  flex flex-col">
        <header className="w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-200 
                         border border-neutral-700 hover:border-neutral-500 
                         rounded-full px-3 py-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Link>

            <h1 className="text-sm sm:text-base text-neutral-300">
              Detalle del producto
            </h1>

            <div className="w-[75px]" />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4">
          <StatusNotification
            variant="loading"
            message="Cargando información del producto..."
            showSpinner
          />
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
        <header className="w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-200 
                         border border-neutral-700 hover:border-neutral-500 
                         rounded-full px-3 py-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Link>

            <h1 className="text-sm sm:text-base text-neutral-300">
              Detalle del producto
            </h1>

            <div className="w-[75px]" />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4">
          <StatusNotification variant="error" message={error || "Producto no encontrado."} />
        </main>
      </div>
    );
  }

  const formattedPrice = product.precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

  const hasOffer = product.oferta && product.oferta > 0;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Header minimal */}
      <header className="w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-200 
                       border border-neutral-700 hover:border-neutral-500 
                       rounded-full px-3 py-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>

          <h1 className="text-sm sm:text-base text-neutral-300">
            Detalle del producto
          </h1>

          <div className="w-[75px]" />
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen del producto */}
          <div className="w-full">
            <div className="relative rounded-2xl aspect-square bg-neutral-800 overflow-hidden">
              <img
                src={product.foto_url}
                alt={product.nombre}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />

              {hasOffer && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500 text-neutral-900 text-xs font-semibold">
                  {product.oferta}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Info del producto */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold">
              {product.nombre}
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              {product.descripcion}
            </p>

            <div className="flex items-center gap-3 mt-2">
              {product.categoria && (
                <span className="px-3 py-1 rounded-full border border-neutral-700 text-xs sm:text-sm">
                  {product.categoria}
                </span>
              )}

              {hasOffer && (
                <span className="px-3 py-1 rounded-full border border-amber-600/60 text-amber-300 text-xs sm:text-sm">
                  Oferta especial
                </span>
              )}
            </div>

            <div className="text-2xl sm:text-3xl font-semibold mt-3">
              {formattedPrice}
            </div>

            {/* Botones */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleWhatsApp}
                className="flex-1 rounded-full bg-green-600 hover:bg-green-500 
                           text-white px-4 py-2 text-sm sm:text-base transition-colors"
              >
                Consultar por WhatsApp
              </button>

              <Link
                to="/"
                className="flex-1 rounded-full border border-neutral-700 hover:border-neutral-500 
                           text-neutral-200 px-4 py-2 text-sm sm:text-base text-center transition-colors"
              >
                Volver a productos
              </Link>
            </div>
          </div>
        </div>

        {/* Nota extra */}
        <div className="max-w-4xl mx-auto px-4 py-8 text-neutral-400 text-sm border-t border-neutral-800 mt-6">
          <p>
            ⚡ Este producto está disponible para venta en el local.  
            Los precios pueden variar según stock y promociones.  
            Consultá disponibilidad por WhatsApp antes de realizar tu compra.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
