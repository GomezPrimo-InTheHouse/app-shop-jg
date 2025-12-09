// src/components/layout/ShopHeader.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, User, Heart, ShoppingCart, Sun, Moon } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { useTheme } from "../../hook/useTheme.js";
import { useAuth } from "../../context/AuthContext.jsx";
import LoginModal from "../shop/LoginModal.jsx";

const ShopHeader = () => {
  const { totalItems, totalAmount, openCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { cliente, logout } = useAuth();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const formatPrice = (value) =>
    Number(value ?? 0).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });

  const handleLoginClick = () => {
    if (cliente) return;
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  // Inicial para mobile (si está logueado)
  const userInitial =
    cliente?.nombre?.[0]?.toUpperCase() || cliente?.apellido?.[0]?.toUpperCase() || null;

  return (
    <>
      <header className="w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          {/* Logo / nombre de la tienda */}
          <Link
            to="/"
            className="text-base font-semibold text-slate-50 tracking-tight"
          >
            JG Shop
          </Link>

          {/* Centro: método de entrega (solo desktop/tablet) */}
          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm
                       text-slate-300 hover:text-white transition-colors"
          >
            <MapPin className="h-4 w-4" />
            <span>
              Elegí el <span className="font-semibold">método de entrega</span>
            </span>
          </button>

          {/* Derecha: login/usuario, favoritos, carrito, theme toggle */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            {/* Ingresar / Usuario – Desktop */}
            <button
              type="button"
              onClick={cliente ? handleLogout : handleLoginClick}
              className="hidden sm:inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <User className="h-4 w-4" />
              <span>
                {cliente ? `Salir (${cliente.nombre})` : "Ingresar"}
              </span>
            </button>

            {/* Ingresar / Usuario – Mobile (solo ícono) */}
            <button
              type="button"
              onClick={cliente ? handleLogout : handleLoginClick}
              className="inline-flex sm:hidden h-9 w-9 items-center justify-center rounded-full 
                         border border-slate-700 bg-slate-900 text-slate-200
                         hover:border-indigo-400 hover:text-white hover:bg-slate-800
                         transition-colors"
              aria-label={cliente ? "Cerrar sesión" : "Iniciar sesión"}
            >
              {cliente && userInitial ? (
                <span className="text-xs font-semibold">
                  {userInitial}
                </span>
              ) : (
                <User className="h-4 w-4" />
              )}
            </button>

            {/* Favoritos (solo desktop por ahora) */}
            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span>Favoritos</span>
            </button>

            {/* Carrito */}
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

            {/* Toggle tema claro/oscuro - siempre al extremo derecho */}
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full 
                         border border-slate-700 bg-slate-900 text-slate-200
                         hover:border-indigo-400 hover:text-white hover:bg-slate-800
                         transition-colors"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Modal de login */}
      <LoginModal
        isOpen={isLoginModalOpen && !cliente}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default ShopHeader;
