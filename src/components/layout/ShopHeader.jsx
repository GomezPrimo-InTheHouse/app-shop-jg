
// src/components/layout/ShopHeader.jsx
// import { Link } from "react-router-dom";
// import { MapPin, User, Heart, ShoppingCart, Sun, Moon } from "lucide-react";

// import { useCart } from "../../context/CartContext.jsx";
// import { useTheme } from "../../hook/useTheme.js";
// import { useAuth } from "../../context/AuthContext.jsx";
// import { useUI } from "../../context/UIContext.jsx";

// import LoginModal from "../shop/LoginModal.jsx";

// const ShopHeader = () => {
//   const { totalItems, totalAmount, openCart } = useCart();
//   const { theme, toggleTheme } = useTheme();
//   const { cliente, logout } = useAuth();

//   // UI Global: controla apertura/cierre del modal desde cualquier página
//   const { isLoginModalOpen, openLoginModal, closeLoginModal } = useUI();

//   const formatPrice = (value) =>
//     Number(value ?? 0).toLocaleString("es-AR", {
//       style: "currency",
//       currency: "ARS",
//       maximumFractionDigits: 0,
//     });

//   // ✅ Abre modal solo si no hay cliente
//   const handleLoginClick = () => {
//     if (cliente) return;
//     openLoginModal(); // ✅ FIX: antes llamabas isLoginModalOpen(true) y rompía
//   };

//   const handleLogout = () => logout();

//   // Inicial para mobile cuando está logueado
//   const userInitial =
//     cliente?.nombre?.[0]?.toUpperCase() ||
//     cliente?.apellido?.[0]?.toUpperCase() ||
//     null;

//   return (
//     <>
//       <header className="w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur dark:bg-slate-950/90">
//         <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
//           {/* Logo */}
//           <Link to="/" className="text-base font-semibold text-slate-50 tracking-tight">
//             JG Shop
//           </Link>

//           {/* Método de entrega (solo desktop/tablet) */}
//           {/* <button
//             type="button"
//             className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors"
//           >
//             <MapPin className="h-4 w-4" />
//             <span>
//               Elegí el <span className="font-semibold">método de entrega</span>
//             </span>
//           </button> */}

//           {/* Acciones derecha */}
//           <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
//             {/* Ingresar / Salir – Desktop */}
//             <button
//               type="button"
//               onClick={cliente ? handleLogout : handleLoginClick}
//               className="hidden sm:inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
//             >
//               <User className="h-4 w-4" />
//               <span>{cliente ? `Salir (${cliente.nombre})` : "Ingresar"}</span>
//             </button>

//             {/* Ingresar / Salir – Mobile (ícono / inicial) */}
//             <button
//               type="button"
//               onClick={cliente ? handleLogout : handleLoginClick}
//               className="inline-flex sm:hidden h-9 w-9 items-center justify-center rounded-full 
//                          border border-slate-700 bg-slate-900 text-slate-200
//                          hover:border-indigo-400 hover:text-white hover:bg-slate-800 transition-colors"
//               aria-label={cliente ? "Cerrar sesión" : "Iniciar sesión"}
//             >
//               {cliente && userInitial ? (
//                 <span className="text-xs font-semibold">{userInitial}</span>
//               ) : (
//                 <User className="h-4 w-4" />
//               )}
//             </button>

//             {/* Favoritos (placeholder) */}
//             <button
//               type="button"
//               className="hidden sm:inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
//             >
//               <Heart className="h-4 w-4" />
//               <span>Favoritos</span>
//             </button>

//             {/* Carrito */}
//             <button
//               type="button"
//               onClick={openCart}
//               className="inline-flex items-center gap-2 rounded-full border border-slate-700 
//                          px-3 py-1.5 text-slate-100 hover:border-indigo-400 hover:bg-slate-900 
//                          hover:text-white transition-colors relative"
//             >
//               <div className="relative">
//                 <ShoppingCart className="h-4 w-4" />
//                 {totalItems > 0 && (
//                   <span
//                     className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center 
//                                rounded-full bg-green-500 px-1 text-[10px] font-bold text-white shadow-md"
//                   >
//                     {totalItems}
//                   </span>
//                 )}
//               </div>

//               <span className="font-semibold text-green-400 text-xs sm:text-sm">
//                 {totalItems > 0 ? formatPrice(totalAmount) : formatPrice(0)}
//               </span>
//             </button>

//             {/* Toggle tema */}
//             <button
//               type="button"
//               onClick={toggleTheme}
//               className="inline-flex h-9 w-9 items-center justify-center rounded-full 
//                          border border-slate-700 bg-slate-900 text-slate-200
//                          hover:border-indigo-400 hover:text-white hover:bg-slate-800 transition-colors"
//               aria-label="Cambiar tema"
//             >
//               {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Modal Login: se abre solo si no hay cliente */}
//       <LoginModal isOpen={isLoginModalOpen && !cliente} onClose={closeLoginModal} />
//     </>
//   );
// };

// export default ShopHeader;


import { Link, useNavigate } from "react-router-dom";
import { MapPin, User, Heart, ShoppingCart, Sun, Moon } from "lucide-react";

import { useCart } from "../../context/CartContext.jsx";
import { useTheme } from "../../hook/useTheme.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useUI } from "../../context/UIContext.jsx";
import { useFavorites } from "../../context/FavoriteContext.jsx";
import { useNotification } from "../../context/NotificationContext.jsx";
import Swal from "sweetalert2";
import LoginModal from "../shop/LoginModal.jsx";

const ShopHeader = () => {
  const navigate = useNavigate();
  const { totalItems, totalAmount, openCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { cliente, logout } = useAuth();
  const { favoriteIds } = useFavorites();
  const { showNotification } = useNotification();

  // UI Global: controla apertura/cierre del modal desde cualquier página
  const { isLoginModalOpen, openLoginModal, closeLoginModal } = useUI();

  const formatPrice = (value) =>
    Number(value ?? 0).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });

  // Inicial para mobile cuando está logueado
  const userInitial =
    cliente?.nombre?.[0]?.toUpperCase() ||
    cliente?.apellido?.[0]?.toUpperCase() ||
    null;

  // 👉 Favoritos
  const handleFavoritesClick = () => {
    if (!cliente) {
      showNotification("info", "Para ver tus favoritos debés iniciar sesión");
      openLoginModal();
      return;
    }
    navigate("/favoritos");
  };

  // 👉 Login / Logout
  const handleLoginClick = () => {
    if (cliente) return;
    openLoginModal();
  };


  
  const handleLogout = () => {

    Swal.fire({
      title: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        showNotification("info", "Sesion cerrada correctamente");

      }
    });
  }

  return (
    <>
      <header className="w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          {/* Logo */}
          <Link to="/" className="text-base font-semibold text-slate-50 tracking-tight">
            JG Shop
          </Link>

          {/* Acciones derecha */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            {/* Login / Logout – Desktop */}
            <button
              type="button"
              onClick={cliente ? handleLogout : handleLoginClick}
              className="hidden sm:inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <User className="h-4 w-4" />
              <span>{cliente ? `Salir (${cliente.nombre})` : "Ingresar"}</span>
            </button>

            {/* Login / Logout – Mobile */}
            <button
              type="button"
              onClick={cliente ? handleLogout : handleLoginClick}
              className="inline-flex sm:hidden h-9 w-9 items-center justify-center rounded-full 
                         border border-slate-700 bg-slate-900 text-slate-200
                         hover:border-indigo-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label={cliente ? "Cerrar sesión" : "Iniciar sesión"}
            >
              {cliente && userInitial ? (
                <span className="text-xs font-semibold">{userInitial}</span>
              ) : (
                <User className="h-4 w-4" />
              )}
            </button>

            {/* ❤️ Favoritos – Mobile + Desktop */}
            <button
              type="button"
              onClick={handleFavoritesClick}
              className="relative inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              aria-label="Ver favoritos"
            >
              <div className="relative">
                <Heart className="h-4 w-4" />
                {favoriteIds.size > 0 && (
                  <span
                    className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center 
                               rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white shadow-md"
                  >
                    {favoriteIds.size}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Favoritos</span>
            </button>

            {/* 🛒 Carrito */}
            <button
              type="button"
              onClick={openCart}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 
                         px-3 py-1.5 text-slate-100 hover:border-indigo-400 hover:bg-slate-900 
                         hover:text-white transition-colors relative"
            >
              <div className="relative">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <span
                    className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center 
                               rounded-full bg-green-500 px-1 text-[10px] font-bold text-white shadow-md"
                  >
                    {totalItems}
                  </span>
                )}
              </div>

              <span className="font-semibold text-green-400 text-xs sm:text-sm">
                {totalItems > 0 ? formatPrice(totalAmount) : formatPrice(0)}
              </span>
            </button>

            {/* 🌙 / ☀️ Tema */}
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full 
                         border border-slate-700 bg-slate-900 text-slate-200
                         hover:border-indigo-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Modal Login */}
      <LoginModal isOpen={isLoginModalOpen && !cliente} onClose={closeLoginModal} />
    </>
  );
};

export default ShopHeader;
