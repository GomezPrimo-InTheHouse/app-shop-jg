// src/components/shop/LoginModal.jsx
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const LoginModal = ({ isOpen, onClose }) => {
  const { login, loading } = useAuth();

  const firstInputRef = useRef(null);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    celular: "",
  });

  // ✅ UX: al abrir, foco en el primer input
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // ✅ UX: al cerrar, resetea form (opcional)
  useEffect(() => {
    if (!isOpen) {
      setForm({ nombre: "", apellido: "", dni: "", celular: "", email: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // AuthContext.login ya muestra el aviso de bienvenida / cupón disponible.
      // Antes este modal mostraba otros 2 avisos y se pisaban entre sí.
      await login(form);
      onClose?.();
    } catch (error) {
      // El mensaje de error también lo muestra AuthContext.login
      console.error(error);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Contenedor modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className="w-full max-w-md rounded-2xl bg-white/90 dark:bg-gray-950/90
                     border border-gray-200 dark:border-gray-800 shadow-2xl p-5 relative
                     text-gray-900 dark:text-gray-100 transition-colors duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-semibold">Tus datos</h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-600 hover:bg-gray-200
                         dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
            Los usamos para registrar tu pedido y coordinar la entrega por WhatsApp.
          </p>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-600 dark:text-gray-400 mb-1">
                  Nombre
                </label>
                <input
                  ref={firstInputRef}
                  type="text"
                  name="nombre"
                  autoComplete="given-name"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg bg-gray-50 dark:bg-gray-800
                             border border-gray-300 dark:border-gray-700
                             px-3 py-2 text-xs sm:text-sm
                             text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-600 dark:text-gray-400 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  autoComplete="family-name"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg bg-gray-50 dark:bg-gray-800
                             border border-gray-300 dark:border-gray-700
                             px-3 py-2 text-xs sm:text-sm
                             text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-gray-600 dark:text-gray-400 mb-1">
                DNI
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                name="dni"
                value={form.dni}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-gray-50 dark:bg-gray-800
                           border border-gray-300 dark:border-gray-700
                           px-3 py-2 text-xs sm:text-sm
                           text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 dark:text-gray-400 mb-1">
                Celular / WhatsApp
              </label>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="353 4123456"
                name="celular"
                value={form.celular}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-gray-50 dark:bg-gray-800
                           border border-gray-300 dark:border-gray-700
                           px-3 py-2 text-xs sm:text-sm
                           text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-gray-600 dark:text-gray-400 mb-1">
                Email (opcional)
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@mail.com"
                className="w-full rounded-lg bg-gray-50 dark:bg-gray-800
                           border border-gray-300 dark:border-gray-700
                           px-3 py-2 text-xs sm:text-sm
                           text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-lg bg-indigo-600 hover:bg-indigo-500
                         disabled:bg-gray-400 dark:disabled:bg-gray-700
                         disabled:cursor-not-allowed
                         text-xs sm:text-sm font-medium text-white py-2.5 transition-colors"
            >
              {loading ? "Guardando..." : "Continuar"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginModal;