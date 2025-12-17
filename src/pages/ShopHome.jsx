// import React from 'react';
// import ShopHeader from "../components/layout/ShopHeader.jsx";
// // Asumiendo que has renombrado el componente a GridShop.jsx (como hablamos antes)
// import ProductGrid from "../components/products/ProductGrid.jsx"; 

// const ShopHome = () => {
//   return (
//     // Contenedor principal: Define los colores base de la aplicación.
//     // Usamos grises más suaves y definimos la transición para el cambio de tema.
//     <div className="min-h-screen 
//                     bg-gray-100 dark:bg-gray-900 
//                     text-gray-900 dark:text-gray-100
//                     transition-colors duration-500
//                     flex flex-col">
//       <ShopHeader />

//       <main className="flex-1 w-full">
//         {/* Contenedor centralizado para el contenido de la página */}
//         <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8">
          
//           {/* 1. Encabezado Principal y Descripción (UX: Claro y Conciso) */}
//           <section className="space-y-2 pt-2 sm:pt-4">
//             <h1 className="text-2xl sm:text-4xl font-extrabold 
//                            text-indigo-600 dark:text-indigo-400">
//               Tienda JG Informática
//             </h1>
//             <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-3xl">
//               Explorá nuestra selección de productos: **cargadores, cables, parlantes, accesorios y más**.
//               Los precios reflejados son una vista previa online. Por favor, consultá stock y promociones vigentes
//               directamente en el negocio físico.
//             </p>
//           </section>

//           {/* 2. Bloque del Catálogo: Contenedor con Filtros y Grid (UX/UI: Estilo Tarjeta Flotante) */}
//           <section  
//             className="bg-white/70 border border-gray-200 backdrop-blur-sm 
//                        dark:bg-gray-950/70 dark:border-gray-800 
//                        rounded-2xl shadow-xl p-4 sm:p-6 space-y-6"
//           >
//             {/* Sub-Encabezado del Bloque */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//                 <div>
//                   <h2 className="text-xl font-semibold 
//                                  text-gray-800 dark:text-gray-100">
//                     Catálogo de Productos
//                   </h2>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     Tenemos más de **150** artículos disponibles.
//                   </p>
//                 </div>
                
//                 {/* Placeholder para Filtros/Búsqueda (Aquí iría tu componente de búsqueda) */}
//                 <div className="w-full sm:w-auto">
//                     {/* <SearchBar /> */}
//                     <button className="w-full sm:w-48 py-2 px-4 rounded-full border 
//                                        text-sm font-medium
//                                        bg-indigo-50 dark:bg-gray-800
//                                        text-indigo-600 dark:text-indigo-400 
//                                        border-indigo-200 dark:border-gray-700
//                                        hover:bg-indigo-100 dark:hover:bg-gray-700
//                                        transition-colors">
//                         Aplicar Filtros
//                     </button>
//                 </div>
//             </div>

//             {/* Separador visual antes del Grid */}
//             <hr className="border-gray-200 dark:border-gray-800" />
            
//             {/* El Grid de Productos */}
//             <ProductGrid />
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ShopHome;

import React from 'react';
import ShopHeader from "../components/layout/ShopHeader.jsx";
import ProductGrid from "../components/products/ProductGrid.jsx";
import { ShoppingBag, ShieldCheck, MapPin, Search } from 'lucide-react'; // Iconos sugeridos

const ShopHome = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-500 flex flex-col">
      <ShopHeader />

      <main className="flex-1">
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          {/* Decoración de fondo (Blur) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[70%] bg-indigo-500 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[70%] bg-blue-500 rounded-full blur-[120px]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-12 sm:py-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wider uppercase">
                  Tecnología a tu alcance
                </span>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                  Tienda <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">JG Informática</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                  Encontrá los mejores accesorios: cargadores, parlantes y más. 
                  <span className="block mt-2 font-medium italic border-l-2 border-indigo-500 pl-4 text-sm">
                    Precios online de referencia. Consultanos stock en nuestro local físico.
                  </span>
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none hover:-translate-y-1">
                    Ver Catálogo
                  </button>
                  <button className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-700">
                    Ubicación
                  </button>
                </div>
              </div>

              {/* Stats / Trust Badges - Desktop Only */}
              <div className="hidden lg:grid grid-cols-2 gap-4">
                {[
                  { icon: <ShoppingBag />, title: "+150 Productos", desc: "Stock actualizado" },
                  { icon: <ShieldCheck />, title: "Garantía Real", desc: "Soporte técnico" },
                  { icon: <MapPin />, title: "Local Físico", desc: "Retiro inmediato" },
                  { icon: <Search />, title: "Búsqueda", desc: "Fácil y rápido" },
                ].map((item, idx) => (
                  <div key={idx} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-indigo-600 mb-3">{item.icon}</div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- PRODUCT SECTION --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden">
            
            {/* Toolbar del Catálogo */}
            <div className="p-6 sm:p-10 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Catálogo de Productos</h2>
                  <p className="text-slate-500 text-sm">Mostrando nuestra selección premium</p>
                </div>
                
                {/* Search & Filter Bar */}
                <div className="flex w-full md:w-auto gap-2">
                  <div className="relative flex-1 md:w-64">
                    <input 
                      type="text" 
                      placeholder="Buscar producto..." 
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  </div>
                  <button className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold flex items-center gap-2">
                    Filtros
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10 bg-slate-50/50 dark:bg-transparent">
              <ProductGrid />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ShopHome;