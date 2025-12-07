import React from 'react';
import ShopHeader from "../components/layout/ShopHeader.jsx";
// Asumiendo que has renombrado el componente a GridShop.jsx (como hablamos antes)
import ProductGrid from "../components/products/ProductGrid.jsx"; 

const ShopHome = () => {
  return (
    // Contenedor principal: Define los colores base de la aplicación.
    // Usamos grises más suaves y definimos la transición para el cambio de tema.
    <div className="min-h-screen 
                    bg-gray-100 dark:bg-gray-900 
                    text-gray-900 dark:text-gray-100
                    transition-colors duration-500
                    flex flex-col">
      <ShopHeader />

      <main className="flex-1 w-full">
        {/* Contenedor centralizado para el contenido de la página */}
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8">
          
          {/* 1. Encabezado Principal y Descripción (UX: Claro y Conciso) */}
          <section className="space-y-2 pt-2 sm:pt-4">
            <h1 className="text-2xl sm:text-4xl font-extrabold 
                           text-indigo-600 dark:text-indigo-400">
              Tienda JG Informática
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-3xl">
              Explorá nuestra selección de productos: **cargadores, cables, parlantes, accesorios y más**.
              Los precios reflejados son una vista previa online. Por favor, consultá stock y promociones vigentes
              directamente en el negocio físico.
            </p>
          </section>

          {/* 2. Bloque del Catálogo: Contenedor con Filtros y Grid (UX/UI: Estilo Tarjeta Flotante) */}
          <section  
            className="bg-white/70 border border-gray-200 backdrop-blur-sm 
                       dark:bg-gray-950/70 dark:border-gray-800 
                       rounded-2xl shadow-xl p-4 sm:p-6 space-y-6"
          >
            {/* Sub-Encabezado del Bloque */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold 
                                 text-gray-800 dark:text-gray-100">
                    Catálogo de Productos
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tenemos más de **150** artículos disponibles.
                  </p>
                </div>
                
                {/* Placeholder para Filtros/Búsqueda (Aquí iría tu componente de búsqueda) */}
                <div className="w-full sm:w-auto">
                    {/* <SearchBar /> */}
                    <button className="w-full sm:w-48 py-2 px-4 rounded-full border 
                                       text-sm font-medium
                                       bg-indigo-50 dark:bg-gray-800
                                       text-indigo-600 dark:text-indigo-400 
                                       border-indigo-200 dark:border-gray-700
                                       hover:bg-indigo-100 dark:hover:bg-gray-700
                                       transition-colors">
                        Aplicar Filtros
                    </button>
                </div>
            </div>

            {/* Separador visual antes del Grid */}
            <hr className="border-gray-200 dark:border-gray-800" />
            
            {/* El Grid de Productos */}
            <ProductGrid />
          </section>
        </div>
      </main>
    </div>
  );
};

export default ShopHome;