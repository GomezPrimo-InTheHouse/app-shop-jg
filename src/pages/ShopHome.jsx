// // // import React from 'react';
// // // import ShopHeader from "../components/layout/ShopHeader.jsx";
// // // // Asumiendo que has renombrado el componente a GridShop.jsx (como hablamos antes)
// // // import ProductGrid from "../components/products/ProductGrid.jsx"; 

// // // const ShopHome = () => {
// // //   return (
// // //     // Contenedor principal: Define los colores base de la aplicación.
// // //     // Usamos grises más suaves y definimos la transición para el cambio de tema.
// // //     <div className="min-h-screen 
// // //                     bg-gray-100 dark:bg-gray-900 
// // //                     text-gray-900 dark:text-gray-100
// // //                     transition-colors duration-500
// // //                     flex flex-col">
// // //       <ShopHeader />

// // //       <main className="flex-1 w-full">
// // //         {/* Contenedor centralizado para el contenido de la página */}
// // //         <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8">
          
// // //           {/* 1. Encabezado Principal y Descripción (UX: Claro y Conciso) */}
// // //           <section className="space-y-2 pt-2 sm:pt-4">
// // //             <h1 className="text-2xl sm:text-4xl font-extrabold 
// // //                            text-indigo-600 dark:text-indigo-400">
// // //               Tienda JG Informática
// // //             </h1>
// // //             <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-3xl">
// // //               Explorá nuestra selección de productos: **cargadores, cables, parlantes, accesorios y más**.
// // //               Los precios reflejados son una vista previa online. Por favor, consultá stock y promociones vigentes
// // //               directamente en el negocio físico.
// // //             </p>
// // //           </section>

// // //           {/* 2. Bloque del Catálogo: Contenedor con Filtros y Grid (UX/UI: Estilo Tarjeta Flotante) */}
// // //           <section  
// // //             className="bg-white/70 border border-gray-200 backdrop-blur-sm 
// // //                        dark:bg-gray-950/70 dark:border-gray-800 
// // //                        rounded-2xl shadow-xl p-4 sm:p-6 space-y-6"
// // //           >
// // //             {/* Sub-Encabezado del Bloque */}
// // //             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
// // //                 <div>
// // //                   <h2 className="text-xl font-semibold 
// // //                                  text-gray-800 dark:text-gray-100">
// // //                     Catálogo de Productos
// // //                   </h2>
// // //                   <p className="text-sm text-gray-500 dark:text-gray-400">
// // //                     Tenemos más de **150** artículos disponibles.
// // //                   </p>
// // //                 </div>
                
// // //                 {/* Placeholder para Filtros/Búsqueda (Aquí iría tu componente de búsqueda) */}
// // //                 <div className="w-full sm:w-auto">
// // //                     {/* <SearchBar /> */}
// // //                     <button className="w-full sm:w-48 py-2 px-4 rounded-full border 
// // //                                        text-sm font-medium
// // //                                        bg-indigo-50 dark:bg-gray-800
// // //                                        text-indigo-600 dark:text-indigo-400 
// // //                                        border-indigo-200 dark:border-gray-700
// // //                                        hover:bg-indigo-100 dark:hover:bg-gray-700
// // //                                        transition-colors">
// // //                         Aplicar Filtros
// // //                     </button>
// // //                 </div>
// // //             </div>

// // //             {/* Separador visual antes del Grid */}
// // //             <hr className="border-gray-200 dark:border-gray-800" />
            
// // //             {/* El Grid de Productos */}
// // //             <ProductGrid />
// // //           </section>
// // //         </div>
// // //       </main>
// // //     </div>
// // //   );
// // // };

// // // export default ShopHome;

// // import React from 'react';
// // import ShopHeader from "../components/layout/ShopHeader.jsx";
// // import ProductGrid from "../components/products/ProductGrid.jsx";
// // import { ShoppingBag, ShieldCheck, MapPin, Search } from 'lucide-react'; // Iconos sugeridos

// // const ShopHome = () => {
// //   return (
// //     <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-500 flex flex-col">
// //       <ShopHeader />

// //       <main className="flex-1">
// //         {/* --- HERO SECTION --- */}
// //         <section className="relative overflow-hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
// //           {/* Decoración de fondo (Blur) */}
// //           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
// //             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[70%] bg-indigo-500 rounded-full blur-[120px]"></div>
// //             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[70%] bg-blue-500 rounded-full blur-[120px]"></div>
// //           </div>

// //           <div className="max-w-7xl mx-auto px-6 py-12 sm:py-20 relative z-10">
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
// //               <div className="space-y-6">
// //                 <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wider uppercase">
// //                   Tecnología a tu alcance
// //                 </span>
// //                 <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
// //                   Tienda <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">JG Informática</span>
// //                 </h1>
// //                 <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
// //                   Encontrá los mejores accesorios: cargadores, parlantes y más. 
// //                   <span className="block mt-2 font-medium italic border-l-2 border-indigo-500 pl-4 text-sm">
// //                     Precios online de referencia. Consultanos stock en nuestro local físico.
// //                   </span>
// //                 </p>
// //                 <div className="flex flex-wrap gap-4">
// //                   <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none hover:-translate-y-1">
// //                     Ver Catálogo
// //                   </button>
// //                   <button className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-700">
// //                     Ubicación
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* Stats / Trust Badges - Desktop Only */}
// //               <div className="hidden lg:grid grid-cols-2 gap-4">
// //                 {[
// //                   { icon: <ShoppingBag />, title: "+150 Productos", desc: "Stock actualizado" },
// //                   { icon: <ShieldCheck />, title: "Garantía Real", desc: "Soporte técnico" },
// //                   { icon: <MapPin />, title: "Local Físico", desc: "Retiro inmediato y envíos gratuitos" },
// //                   { icon: <Search />, title: "Búsqueda", desc: "Fácil y rápido" },
// //                 ].map((item, idx) => (
// //                   <div key={idx} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
// //                     <div className="text-indigo-600 mb-3">{item.icon}</div>
// //                     <h3 className="font-bold">{item.title}</h3>
// //                     <p className="text-xs text-slate-500">{item.desc}</p>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* --- PRODUCT SECTION --- */}
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
// //           <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden">
            
// //             {/* Toolbar del Catálogo */}
// //             <div className="p-6 sm:p-10 border-b border-slate-100 dark:border-slate-800">
// //               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
// //                 <div className="space-y-1">
// //                   <h2 className="text-2xl font-bold">Catálogo de Productos</h2>
// //                   <p className="text-slate-500 text-sm">Mostrando nuestra selección premium</p>
// //                 </div>
                
// //                 {/* Search & Filter Bar */}
// //                 <div className="flex w-full md:w-auto gap-2">
// //                   <div className="relative flex-1 md:w-64">
// //                     <input 
// //                       type="text" 
// //                       placeholder="Buscar producto..." 
// //                       className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
// //                     />
// //                     <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
// //                   </div>
// //                   <button className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold flex items-center gap-2">
// //                     Filtros
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="p-6 sm:p-10 bg-slate-50/50 dark:bg-transparent">
// //               <ProductGrid />
// //             </div>
// //           </section>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, MapPin, Search, X, MessageCircle, ExternalLink } from 'lucide-react';
import ShopHeader from "../components/layout/ShopHeader.jsx";
import ProductGrid from "../components/products/ProductGrid.jsx";

const ShopHome = () => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  // NOTA: Reemplaza este SRC por el que te da Google Maps en "Compartir -> Insertar mapa"
  const googleMapsSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3393.737144983944!2d-63.2452044!3d-32.41328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDI0JzQ3LjgiUyA2M8KwMTQnNDIuNyJX!5e0!3m2!1ses-419!2sar!4v1700000000000";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f1a] text-slate-900 dark:text-slate-100 transition-colors duration-500 flex flex-col">
      <ShopHeader />

      <main className="flex-1">
        {/* --- HERO SECTION --- */}
        <section className="relative pt-8 pb-12 sm:py-20 overflow-hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              
              <div className="w-full lg:w-3/5 space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  Abierto para consultas
                </span>
                
                <h1 className="text-4xl sm:text-7xl font-black tracking-tight leading-[1.1]">
                  JG <span className="text-indigo-600 dark:text-indigo-500">Informática</span>
                </h1>
                
                <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Tu tienda de confianza para accesorios y tecnología. 
                  <span className="block font-semibold text-slate-800 dark:text-slate-200 mt-2">
                    Consultá stock en tiempo real por WhatsApp.
                  </span>
                </p>

                {/* GRUPO DE BOTONES OPTIMIZADO PARA MOBILE */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <a 
                    href="https://wa.link/qeelcn" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    <MessageCircle fill="currentColor" />
                    Consultar WhatsApp
                  </a>
                  <button 
                    onClick={() => setIsMapOpen(true)}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl font-bold text-lg transition-all active:scale-95"
                  >
                    <MapPin className="text-indigo-500" />
                    Ver Ubicación
                  </button>
                </div>
              </div>

              {/* TRUST BADGES - GRID ADAPTATIVO */}
              <div className="grid grid-cols-2 gap-3 w-full lg:w-2/5">
                {[
                  { label: "Stock", val: "+150 Art.", color: "bg-blue-500" },
                  { label: "Garantía", val: "Oficial", color: "bg-purple-500" },
                  { label: "Atención", val: "Personal", color: "bg-orange-500" },
                  { label: "Envíos", val: "Locales", color: "bg-emerald-500" },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">{item.label}</p>
                    <p className="text-lg font-bold">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- CATÁLOGO --- */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col gap-6 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <ShoppingBag className="text-indigo-500" />
              Nuestros Productos
            </h2>
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="¿Qué estás buscando hoy?" 
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
              />
            </div>
          </div>
          <ProductGrid />
        </div>
      </main>

      {/* --- MODAL DE MAPA OPTIMIZADO --- */}
      {isMapOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsMapOpen(false)}></div>
          
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
            <div className="flex items-center justify-between p-5 border-b dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-500">
                  <MapPin size={20} />
                </div>
                <h3 className="font-bold">Nuestra Ubicación</h3>
              </div>
              <button onClick={() => setIsMapOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                <X size={20} />
              </button>
            </div>
            
            {/* Contenedor del Iframe Responsivo */}
            <div className="relative w-full h-[60vh] sm:h-[450px] bg-slate-200 dark:bg-slate-800">
              <iframe 
                src={googleMapsSrc}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            
            <div className="p-5 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 text-center sm:text-left">
                Visitános en nuestro local para asesoramiento técnico.
              </p>
              <a 
                href="https://www.google.com/maps/dir//TU+UBICACION+AQUI" // Agregá tu link de Google Maps Directo
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm"
              >
                Abrir en Google Maps
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* BOTÓN FLOTANTE WHATSAPP (Solo Mobile) */}
      <a 
        href="https://wa.link/qeelcn"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 p-4 bg-emerald-500 text-white rounded-full shadow-2xl sm:hidden active:scale-90 transition-transform"
      >
        <MessageCircle size={24} fill="currentColor" />
      </a>
    </div>
  );
};

export default ShopHome;