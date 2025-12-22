

import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, MapPin, Search, X, MessageCircle, ExternalLink, Store } from 'lucide-react';
import ShopHeader from "../components/layout/ShopHeader.jsx";
import ProductGrid from "../components/products/ProductGrid.jsx";
import Logo from '../components/layout/Logo.jsx'
import logoJG from "../assets/logo-1-sin-fondo.png";

const ShopHome = () => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  // NOTA: Reemplaza este SRC por el que te da Google Maps en "Compartir -> Insertar mapa"
  const googleMapsSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3368.012063720076!2d-63.2356383239807!3d-32.418834945426866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95cc43da9e9efa5d%3A0xb7299c488061375c!2sJulian%20Gomez%20Inform%C3%A1tica!5e0!3m2!1ses!2sar!4v1765998900707!5m2!1ses!2sar";

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

                {/* <Logo className="mx-auto lg:mx-0" /> */}
                <img
                  src={logoJG}
                  alt="Logo de JG Informática"
                  style={{
                    height: "clamp(8rem, 18vw, 20rem)",
                    width: "auto",
                    transition: "transform 0.3s ease, filter 0.3s ease",
                  }}
                  className="
                  mx-auto lg:mx-0
                  invert-0
                  dark:invert
                  sm:hover:scale-105
                  sm:hover:drop-shadow-[0_0_10px_rgba(79,163,209,0.5)]
                "
                  draggable="false"
                />


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
                    rel="noopener noreferrer"
                    className="
                    inline-flex items-center justify-center gap-3
                    px-8 py-4
                    rounded-2xl
                    font-bold text-lg

                    bg-emerald-500 text-white
                    hover:bg-emerald-600
                    active:scale-95

                    shadow-lg shadow-emerald-500/25
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-emerald-400/50
                  "
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsMapOpen(true)}
                    className="
                    inline-flex items-center justify-center gap-3
                    px-8 py-4
                    rounded-2xl
                    font-semibold text-lg

                    bg-slate-100 text-slate-800
                    hover:bg-slate-200

                    dark:bg-slate-800 dark:text-slate-200
                    dark:hover:bg-slate-700

                    transition-all duration-200
                    active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-indigo-400/40
  "
                  >
                    <MapPin className="h-5 w-5 text-indigo-500" />
                    <span>Ubicación</span>
                  </button>

                  <a
                    href="https://web-jg-informatica.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
    inline-flex items-center justify-center gap-2
    px-7 py-3.5
    rounded-2xl
    font-semibold text-base

    bg-slate-100 text-slate-800
    hover:bg-slate-200

    dark:bg-slate-800 dark:text-slate-200
    dark:hover:bg-slate-700

    transition-all duration-200
    active:scale-95
  "
                  >
                    <Store className="h-5 w-5 text-indigo-500" />
                    <span>Visitar la web</span>
                    <ExternalLink className="h-4 w-4 opacity-60" />
                  </a>


                </div>
              </div>

              {/* TRUST BADGES - GRID ADAPTATIVO */}
              <div className="grid grid-cols-2 gap-3 w-full lg:w-2/5">
                {[
                  { label: "Amplio Stock", val: "+1500 Art.", color: "bg-blue-500", icon: "📦" },
                  { label: "Envíos locales", val: "Oficial", color: "bg-purple-500", icon: "🚚" },
                  { label: "Atención 1 a 1", val: "Personal", color: "bg-orange-500", icon: "🤝" },
                  { label: "Retiro en tienda", val: "Local físico", color: "bg-emerald-500", icon: "🚚" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="
    p-4 rounded-2xl text-center transition-all duration-300

    /* LIGHT MODE */
    bg-gradient-to-br from-white to-slate-50
    border border-slate-200
    shadow-sm hover:shadow-md hover:-translate-y-0.5

    /* DARK MODE */
    dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950
    dark:border-slate-800
    dark:shadow-none dark:hover:shadow-none
  "
                  >


                    <span className="text-xl">{item.icon}</span>

                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1">
                      {item.label}
                    </p>

                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {item.val}
                    </p>
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