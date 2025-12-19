

// export default MisFavoritosPage;
import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { HeartOff, ArrowLeft, Loader2, UserCircle, ShoppingBag } from "lucide-react";
import ProductCard from "../components/products/ProductCard.jsx";
import ShopHeader from "../components/layout/ShopHeader.jsx";
import { useFavorites } from "../context/FavoriteContext";
import { useNotification } from "../context/NotificationContext";
import { useTheme } from "../hook/useTheme";

const MisFavoritosPage = () => {
  const { theme } = useTheme();
  const { favoriteProducts, loadingFavorites, loadFavorites } = useFavorites();
  const { showNotification } = useNotification();

  // Forzar scroll al inicio y cargar datos al montar
  useEffect(() => {
    loadFavorites();
    window.scrollTo(0, 0);
  }, [loadFavorites]);

  // Validación de sesión persistente
  const buyer = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("jg_shop_buyer") || "null");
    } catch { return null; }
  }, []);

  const isLogged = Boolean(buyer?.cliente?.id);

  // Paleta de estilos consistente con el sistema de Temas
  const styles = {
    mainContainer: "min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100",
    sectionCard: "rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md shadow-sm dark:shadow-none",
    textMuted: "text-slate-500 dark:text-slate-400",
    buttonSecondary: "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95",
    buttonPrimary: "inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
  };

  // --- VIEW: USUARIO NO AUTENTICADO ---
  if (!isLogged) {
    return (
      <div className={styles.mainContainer}>
        <ShopHeader />
        <main className="max-w-4xl mx-auto px-4 py-20">
          <div className={`${styles.sectionCard} p-12 text-center`}>
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10 mb-6">
              <UserCircle className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tight">Tu Colección Privada</h1>
            <p className={`mt-4 max-w-sm mx-auto font-medium ${styles.textMuted}`}>
              Iniciá sesión para guardar tus productos favoritos y verlos en cualquier momento.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className={styles.buttonPrimary} onClick={() => showNotification("info", "Iniciá sesión para continuar")}>
                Iniciar Sesión
              </Link>
              <Link to="/" className={styles.buttonSecondary}>
                Explorar el Shop
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      <ShopHeader />
      
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* --- HEADER DE SECCIÓN --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-8 rounded-full bg-indigo-500" />
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Mi Perfil
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight italic uppercase leading-none">
              Mis Favoritos
            </h1>
            <p className={`text-lg font-medium ${styles.textMuted}`}>
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto seleccionado' : 'productos seleccionados'}
            </p>
          </div>

          <Link to="/" className={styles.buttonSecondary}>
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>
        </div>

        {/* --- GRID Y ESTADOS DE CARGA --- */}
        <div className="relative min-h-[50vh]">
          {loadingFavorites ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative h-16 w-16">
                <Loader2 className="h-16 w-16 animate-spin text-indigo-500 opacity-20" />
                <Loader2 className="absolute top-0 h-16 w-16 animate-spin text-indigo-600 [animation-duration:1.5s]" />
              </div>
              <p className={`mt-4 text-sm font-bold uppercase tracking-widest ${styles.textMuted} animate-pulse`}>
                Sincronizando...
              </p>
            </div>
          ) : favoriteProducts.length === 0 ? (
            /* --- EMPTY STATE --- */
            <div className={`${styles.sectionCard} py-24 px-6 text-center border-dashed border-2`}>
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 mb-6">
                <HeartOff className="h-12 w-12 text-slate-300 dark:text-slate-600" />
              </div>
              <h2 className="text-2xl font-black italic uppercase">¿Tu lista está vacía?</h2>
              <p className={`mt-2 max-w-xs mx-auto font-medium ${styles.textMuted}`}>
                No te quedes con las ganas. Agregá los productos que más te gustan aquí.
              </p>
              <Link to="/" className={`mt-10 ${styles.buttonPrimary}`}>
                <ShoppingBag className="mr-2 h-5 w-5" />
                Ir a comprar
              </Link>
            </div>
          ) : (
            /* --- GRILLA ULTRA-UNIFORME --- */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 items-stretch">
              {favoriteProducts.map((p, idx) => (
                <div 
                  key={p.id} 
                  className="animate-in fade-in slide-in-from-bottom-6 duration-700 flex h-full"
                  style={{ animationDelay: `${idx * 70}ms` }} // Efecto cascada premium
                >
                  {/* Pasamos el objeto 'p' directamente. 
                      Recuerda que en el Context debes haber mapeado 'items' para que 'favoriteProducts' 
                      sea el array de los productos internos. */}
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MisFavoritosPage;