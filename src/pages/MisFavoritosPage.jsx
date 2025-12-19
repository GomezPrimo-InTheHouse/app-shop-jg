// import React, { useEffect, useMemo } from "react";
// import { Link } from "react-router-dom";
// import { HeartOff, ArrowLeft, Loader2, UserCircle, ShoppingBag } from "lucide-react";
// import ProductCard from "../components/products/ProductCard.jsx";
// import ShopHeader from "../components/layout/ShopHeader.jsx";
// import { useFavorites } from "../context/FavoriteContext";
// import { useNotification } from "../context/NotificationContext";
// import { useTheme } from "../hook/useTheme";

// const MisFavoritosPage = () => {
//   const { theme } = useTheme();
//   const { favoriteProducts, loadingFavorites, loadFavorites } = useFavorites();
//   const { showNotification } = useNotification();

//   useEffect(() => {
//     loadFavorites();
//     window.scrollTo(0, 0);
//   }, [loadFavorites]);

//   // Lógica de validación de sesión
//   const buyer = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("jg_shop_buyer") || "null");
//     } catch { return null; }
//   }, []);

//   const isLogged = Boolean(buyer?.cliente?.id);

//   // Clases dinámicas basadas en el diseño UX de alto nivel
//   const styles = {
//     mainContainer: "min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100",
//     sectionCard: "rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md shadow-sm dark:shadow-none",
//     textMuted: "text-slate-500 dark:text-slate-400",
//     buttonSecondary: "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all",
//     buttonPrimary: "inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
//   };

//   // --- VIEW: NO LOGUEADO ---
//   if (!isLogged) {
//     return (
//       <div className={styles.mainContainer}>
//         <ShopHeader />
//         <main className="max-w-4xl mx-auto px-4 py-20">
//           <div className={`${styles.sectionCard} p-10 text-center`}>
//             <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10 mb-6">
//               <UserCircle className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
//             </div>
//             <h1 className="text-3xl font-extrabold tracking-tight">Tu lista de deseos</h1>
//             <p className={`mt-4 max-w-sm mx-auto ${styles.textMuted}`}>
//               Iniciá sesión para guardar tus productos favoritos y verlos desde cualquier dispositivo.
//             </p>
//             <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
//               <Link to="/login" className={styles.buttonPrimary}>
//                 Iniciar Sesión
//               </Link>
//               <Link to="/" className={styles.buttonSecondary}>
//                 Volver al inicio
//               </Link>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.mainContainer}>
//       <ShopHeader />
      
//       <main className="max-w-7xl mx-auto px-4 py-10">
//         {/* --- HEADER SECCIÓN --- */}
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <span className="flex h-2 w-2 rounded-full bg-indigo-500" />
//               <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
//                 Personal
//               </span>
//             </div>
//             <h1 className="text-4xl font-black tracking-tight italic uppercase">
//               Mis Favoritos
//             </h1>
//             <p className={styles.textMuted}>
//               {favoriteProducts.length} {favoriteProducts.length === 1 ? 'artículo guardado' : 'artículos guardados'}
//             </p>
//           </div>

//           <Link to="/" className={styles.buttonSecondary}>
//             <ArrowLeft className="h-4 w-4" />
//             Seguir explorando
//           </Link>
//         </div>

//         {/* --- CONTENIDO DINÁMICO --- */}
//         <div className="relative min-h-[50vh]">
//           {loadingFavorites ? (
//             <div className="flex flex-col items-center justify-center py-32">
//               <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
//               <p className={`text-sm font-medium ${styles.textMuted} animate-pulse`}>
//                 Buscando tus tesoros...
//               </p>
//             </div>
//           ) : favoriteProducts.length === 0 ? (
//             /* --- EMPTY STATE --- */
//             <div className={`${styles.sectionCard} py-24 px-6 text-center border-dashed`}>
//               <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 mb-6">
//                 <HeartOff className="h-12 w-12 text-slate-300 dark:text-slate-600" />
//               </div>
//               <h2 className="text-2xl font-bold">¿Nada por aquí?</h2>
//               <p className={`mt-2 max-w-xs mx-auto ${styles.textMuted}`}>
//                 Parece que aún no has marcado ningún producto como favorito.
//               </p>
//               <Link to="/" className={`mt-8 ${styles.buttonPrimary}`}>
//                 <ShoppingBag className="mr-2 h-4 w-4" />
//                 Ir a vitrina
//               </Link>
//             </div>
//           ) : (
//             /* --- GRID DE PRODUCTOS --- */
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
//               {favoriteProducts.map((p, idx) => (
//                 <div 
//                   key={p.id} 
//                   className="animate-in fade-in slide-in-from-bottom-5 duration-700"
//                   style={{ animationDelay: `${idx * 50}ms` }}
//                 >
//                   {/* Nota: Asegúrate que el prop sea 'producto' o 'product' según tu componente */}
//                   <ProductCard product={p} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

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

  useEffect(() => {
    loadFavorites();
    window.scrollTo(0, 0);
  }, [loadFavorites]);

  const buyer = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("jg_shop_buyer") || "null");
    } catch { return null; }
  }, []);

  const isLogged = Boolean(buyer?.cliente?.id);

  const styles = {
    mainContainer: "min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100",
    sectionCard: "rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md shadow-sm dark:shadow-none",
    textMuted: "text-slate-500 dark:text-slate-400",
    buttonSecondary: "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all",
    buttonPrimary: "inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
  };

  if (!isLogged) {
    /* ... (Mismo estado no logueado anterior) ... */
  }

  return (
    <div className={styles.mainContainer}>
      <ShopHeader />
      
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Personal</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight italic uppercase">Mis Favoritos</h1>
            <p className={styles.textMuted}>
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'artículo guardado' : 'artículos guardados'}
            </p>
          </div>

          <Link to="/" className={styles.buttonSecondary}>
            <ArrowLeft className="h-4 w-4" />
            Seguir explorando
          </Link>
        </div>

        <div className="relative min-h-[50vh]">
          {loadingFavorites ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
              <p className={`text-sm font-medium ${styles.textMuted} animate-pulse`}>Buscando tus tesoros...</p>
            </div>
          ) : favoriteProducts.length === 0 ? (
            <div className={`${styles.sectionCard} py-24 px-6 text-center border-dashed`}>
              {/* ... (Mismo empty state anterior) ... */}
            </div>
          ) : (
            /* GRILLA OPTIMIZADA: cards con h-full */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 items-stretch">
              {favoriteProducts.map((p, idx) => (
                <div 
                  key={p.id} 
                  className="animate-in fade-in slide-in-from-bottom-5 duration-700 flex"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
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