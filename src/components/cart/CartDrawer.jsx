// src/components/cart/CartDrawer.jsx
import { X, MapPin, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { useNavigate, } from "react-router-dom";
import { } from "lucide-react";

const CartDrawer = () => {
  const { items, isCartOpen, closeCart, totalAmount, removeItem } = useCart();
  const navigate = useNavigate();
  const googleMapsSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3368.012063720076!2d-63.2356383239807!3d-32.418834945426866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95cc43da9e9efa5d%3A0xb7299c488061375c!2sJulian%20Gomez%20Inform%C3%A1tica!5e0!3m2!1ses!2sar!4v1765998900707!5m2!1ses!2sar";
  const [modalOpen, setModalOpen] = useState(false);

  // 🔧 Fix: proteger por si value viene undefined / null
  const formatPrice = (value) => {
    const num = Number(value ?? 0); // si viene undefined/null -> 0
    return num.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });
  };

  const handleContinueShopping = () => {
    closeCart();
    navigate(-1);
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300
        ${isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closeCart}
      />

      {/* DRAWER */}
      <aside
        className={`
          fixed right-0 top-0 z-50 h-full
          w-full sm:w-[380px] lg:w-[30%]
          bg-slate-100 text-slate-900
          dark:bg-slate-950 dark:text-slate-100
          border-l border-slate-200 dark:border-slate-800
          shadow-2xl transition-transform duration-300
          flex flex-col
          ${isCartOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h2 className="text-sm font-semibold sm:text-base">Carrito de compras</h2>

          <button
            onClick={closeCart}
            className="rounded-full p-1.5 text-slate-600 hover:bg-slate-200
                       dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* LISTA DE PRODUCTOS */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tu carrito está vacío.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 rounded-lg border border-slate-200 bg-white p-2
                dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800">
                  {item.foto_url ? (
                    <img
                      src={item.foto_url}
                      alt={item.nombre}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-500 dark:text-slate-400">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between flex-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-2">
                    {item.nombre}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {formatPrice(item.precio)} x {item.quantity}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[11px] text-red-500 hover:text-red-400"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-4 py-4 space-y-4 shadow-lg">

          {/* BOTÓN MAPS */}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2
             rounded-xl border border-slate-700 bg-slate-900
             px-4 py-3 text-sm font-semibold text-slate-100
             hover:border-indigo-400 hover:bg-slate-800 transition-colors"
          >
            <MapPin size={18} />
            Ver ubicación del local
          </button>


          {/* TOTAL */}
          <div className="flex items-center justify-between text-sm py-1">
            <span className="text-slate-600 dark:text-slate-300">Total:</span>
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatPrice(totalAmount)}
            </span>
          </div>

          {/* FINALIZAR COMPRA */}
          <button
            disabled={items.length === 0}
            onClick={() => {
              if (items.length === 0) return;
              closeCart();
              navigate("/checkout");
            }}
            className="w-full rounded-full bg-green-600 hover:bg-green-700
                    text-white text-sm font-semibold py-2 shadow-md transition
                    disabled:opacity-40"
          >
            Finalizar compra
          </button>

          {/* SEGUIR COMPRANDO */}
          <button
            onClick={handleContinueShopping}
            className="w-full rounded-full border border-slate-400 text-slate-700
                       bg-white hover:bg-slate-200 py-2 text-sm font-semibold
                       dark:bg-slate-900 dark:text-slate-200 dark:border-slate-600 
                       dark:hover:bg-slate-800"
          >
            Seguir comprando
          </button>
        </footer>
      </aside>

      {/* --- MODAL DE MAPA OPTIMIZADO --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <MapPin size={20} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">
                  Nuestra Ubicación
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-300 hover:opacity-90"
                aria-label="Cerrar"
              >
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
                title="Mapa - JG Informática"
              />
            </div>

            <div className="p-5 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-600 dark:text-slate-300 text-center sm:text-left">
                Visitános en nuestro local para asesoramiento técnico.
              </p>

              <a
                href="https://www.google.com/maps/dir//Julian+Gomez+Inform%C3%A1tica"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-colors"
              >
                Abrir en Google Maps
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default CartDrawer;
