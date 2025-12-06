import { ArrowLeft, ShoppingBag } from "lucide-react";

const ShopHeader = () => {
  const handleBackHome = () => {
    // Cambia esta URL por la de tu landing page
    window.location.href = "https://tulanding.com";
  };

  return (
    <header className="w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Volver */}
        <button
          onClick={handleBackHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-200 
                     border border-neutral-700 hover:border-neutral-500 
                     rounded-full px-3 py-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </button>

        {/* Logo / Nombre */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            <span className="font-semibold text-base sm:text-lg tracking-wide">
              JG Shop
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 hidden sm:block">
            Accesorios, cargadores, parlantes y más.
          </p>
        </div>

        {/* Placeholder derecha */}
        <div className="w-[88px]" />
      </div>
    </header>
  );
};

export default ShopHeader;
