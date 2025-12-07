import { ShoppingBag, Globe, UserCircle } from "lucide-react"; 
import ThemeToggleButton from "../buttons/ThemeToggleButton";

const ShopHeader = () => {
  // Define la URL de la landing page.
  const landingPageURL = "https://web-jg-informatica.vercel.app/"; 

  // Función placeholder para el login
  const handleLogin = () => {
      alert("Redirigiendo a la página de Login/Perfil...");
      // Aquí iría la lógica de navegación a tu ruta /login o /profile
  };

  return (
    // Sticky Header con Estilos Dark Mode
    <header 
      className="w-full border-b backdrop-blur-sm sticky top-0 z-20
                 bg-gray-50/95 dark:bg-gray-950/95 
                 border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* 1. Botón de Navegación a la Web Principal (IZQUIERDA) */}
        <a
          href={landingPageURL}
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium
                     text-gray-700 dark:text-gray-300 
                     border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-900
                     hover:bg-gray-100 dark:hover:bg-gray-800 
                     rounded-full px-3 py-1.5 transition-colors duration-200"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">Conocer la Web</span>
          <span className="sm:hidden">Web</span>
        </a>

        {/* 2. Logo / Nombre (CENTRO) */}
        <div className="flex flex-col items-center justify-center -ml-2 sm:ml-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-base sm:text-xl tracking-wide 
                             text-gray-900 dark:text-gray-100">
              JG Shop
            </span>
          </div>
          <p className="text-[10px] sm:text-xs font-light 
                        text-gray-500 dark:text-gray-400 hidden sm:block">
            Accesorios, cargadores, parlantes y más
          </p>
        </div>
        
        {/* 3. Controles de Usuario (DERECHA) - Agrupados y Ordenados */}
        <div className="flex items-center gap-3">
            
            {/* NUEVO: Botón de Perfil / Login */}
            <button
                onClick={handleLogin}
                aria-label="Iniciar sesión o ver perfil de usuario"
                className="p-2 rounded-full transition-colors duration-300 
                           bg-gray-100 dark:bg-gray-800 
                           hover:bg-gray-200 dark:hover:bg-gray-700 
                           text-gray-600 dark:text-gray-300"
            >
                <UserCircle className="h-6 w-6" />
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggleButton />
            
            {/* Botón de Carrito de Compras (Placeholder) */}
            <button
                aria-label="Ver carrito de compras"
                className="p-2 rounded-full transition-colors duration-300 
                           bg-indigo-100 dark:bg-indigo-900 
                           hover:bg-indigo-200 dark:hover:bg-indigo-800 
                           text-indigo-600 dark:text-indigo-300"
            >
                <ShoppingBag className="h-6 w-6" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default ShopHeader;