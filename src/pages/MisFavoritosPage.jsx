// src/pages/MisFavoritosPage.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { HeartOff, ArrowLeft } from "lucide-react";
import ProductCard from "../components/products/ProductCard.jsx"; // ajustá path real
import { useFavorites } from "../context/FavoriteContext";
import { useNotification } from "../context/NotificationContext";

const MisFavoritosPage = () => {
  const { favoriteProducts, loadingFavorites, loadFavorites } = useFavorites();
  const { showNotification } = useNotification();

  useEffect(() => {
    // por si entran directo a la ruta y aún no cargó
    loadFavorites();
  }, [loadFavorites]);

  const buyerRaw = (() => {
    try {
      return JSON.parse(localStorage.getItem("jg_shop_buyer") || "null");
    } catch {
      return null;
    }
  })();

  const clienteId = Number(buyerRaw?.cliente?.id);
  const logged = Number.isFinite(clienteId);

  if (!logged) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
            Mis Favoritos
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Para ver tus favoritos tenés que iniciar sesión.
          </p>

          <div className="mt-4 flex gap-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold
                         bg-indigo-600 text-white hover:bg-indigo-700 transition"
              onClick={() => showNotification("info", "Iniciá sesión para ver tus favoritos")}
            >
              Ir a Login
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold
                         border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Volver al Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100">
            Mis Favoritos
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Guardá productos para encontrarlos rápido después.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold
                     border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200
                     hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
      </div>

      <div className="mt-5">
        {loadingFavorites ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Cargando favoritos...</p>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <HeartOff className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div>
            <h2 className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">
              No tenés favoritos todavía
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Tocá el corazón en cualquier producto para guardarlo acá.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold
                         bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Ir al Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favoriteProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisFavoritosPage;
