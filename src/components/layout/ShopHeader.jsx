import { Link } from "react-router-dom";
import { MapPin, User, Heart, ShoppingCart, Sun, Moon } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { useTheme } from "../../hook/useTheme.js"; // 👈 ajustá la ruta si tu hook está en otro lado

const ShopHeader = () => {
  const { totalItems, totalAmount, openCart } = useCart();
  const { theme, toggleTheme } = useTheme();

  const formatPrice = (value) =>
    value.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });

  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo / nombre de la tienda */}
        <Link
          to="/"
          className="text-base font-semibold text-slate-50 tracking-tight"
        >
          JG Shop
        </Link>

        {/* Centro: método de entrega (futuro modal) */}
        <button
          type="button"
          className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm
                     text-slate-300 hover:text-white transition-colors"
          // TODO: acá vamos a abrir el modal de puntos de retiro
        >
          <MapPin className="h-4 w-4" />
          <span>
            Elegí el <span className="font-semibold">método de entrega</span>
          </span>
        </button>

        {/* Derecha: login, favoritos, carrito, theme toggle */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          {/* Ingresar */}
          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
          >
            <User className="h-4 w-4" />
            <span>Ingresar</span>
          </button>

          {/* Favoritos */}
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

          {/* Toggle tema claro/oscuro - SIEMPRE AL EXTREMO DERECHO */}
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
  );
};

export default ShopHeader;
