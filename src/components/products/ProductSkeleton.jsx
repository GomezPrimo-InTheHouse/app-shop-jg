import React from 'react';

const ProductSkeleton = () => {
  return (
    // Contenedor de la Tarjeta: Mismos estilos que ProductCard (rounded-xl, shadow-lg)
    <div 
      className="flex flex-col rounded-xl overflow-hidden shadow-lg 
                 bg-white dark:bg-gray-800 animate-pulse border border-gray-100 dark:border-gray-700"
      aria-hidden="true" // Esconde el elemento de los lectores de pantalla
    >
      {/* 1. Área de la Imagen (Aspect Ratio) */}
      <div 
        className="relative aspect-square 
                   bg-gray-200 dark:bg-gray-700" 
      >
        {/* Placeholder para la etiqueta "Nuevo" */}
        <span className="absolute top-2 left-2 w-12 h-4 rounded-full bg-gray-300 dark:bg-gray-600"></span>
      </div>

      {/* 2. Contenido de la Tarjeta */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        
        {/* Nombre y Rating */}
        <div>
            {/* Línea de Título */}
            <div className="h-4 w-3/4 rounded-md mb-2 
                            bg-gray-300 dark:bg-gray-600"></div>
            {/* Rating Placeholder */}
            <div className="h-3 w-1/4 rounded-md mb-3 
                            bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Precio y Botón de Añadir */}
        <div className="flex items-center justify-between mt-2">
            
            {/* Placeholder de Precio */}
            <div className="h-6 w-1/3 rounded-md 
                            bg-indigo-300 dark:bg-indigo-700"></div>

            {/* Placeholder de Botón de Añadir */}
            <div className="w-9 h-9 rounded-full 
                            bg-gray-300 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;