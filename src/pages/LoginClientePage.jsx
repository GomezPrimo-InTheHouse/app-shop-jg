// src/pages/LoginClientePage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useCoupon } from "../context/CouponContext";
import ThemeToggleButton from "../components/buttons/ThemeToggleButton";

const LoginClientePage = () => {
  const { login, loading } = useAuth();
  const { showNotification } = useNotification();
  const { aplicarCupon } = useCoupon();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { cliente, cuponBienvenida, emailCuponEnviado } = await login(form);

      showNotification("success", `Bienvenido/a ${cliente.nombre}!`);

      if (cuponBienvenida) {
        aplicarCupon({
          cupon: cuponBienvenida,
          descuento_monto: 0,
          total_con_descuento: null,
        });

        let msg = `🎁 Tenés un cupón de bienvenida: ${cuponBienvenida.codigo}`;
        if (emailCuponEnviado) msg += " (también te lo enviamos por mail)";
        showNotification("info", msg);
      }
    } catch (error) {
      console.error(error);
      showNotification(
        "error",
        "No se pudo iniciar sesión. Verificá los datos."
      );
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col
                 bg-gray-100 dark:bg-gray-900
                 text-gray-900 dark:text-gray-100
                 transition-colors duration-500"
    >
      {/* Barra superior mínima con el botón de tema */}
      <header className="w-full px-4 py-3 flex justify-end">
        <ThemeToggleButton />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-8 pt-2">
        <div
          className="w-full max-w-md rounded-2xl
                     bg-white/80 dark:bg-gray-950/80
                     border border-gray-200 dark:border-gray-800
                     shadow-xl p-6"
        >
          <h1 className="text-2xl font-semibold mb-2 text-center">
            Iniciar sesión en el Shop
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
            Completá tus datos para acceder a tus cupones y compras.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg
                             bg-gray-50 dark:bg-gray-800
                             border border-gray-300 dark:border-gray-700
                             px-3 py-2 text-sm
                             text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg
                             bg-gray-50 dark:bg-gray-800
                             border border-gray-300 dark:border-gray-700
                             px-3 py-2 text-sm
                             text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                DNI
              </label>
              <input
                type="text"
                name="dni"
                value={form.dni}
                onChange={handleChange}
                required
                className="w-full rounded-lg
                           bg-gray-50 dark:bg-gray-800
                           border border-gray-300 dark:border-gray-700
                           px-3 py-2 text-sm
                           text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Email (opcional)
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@mail.com"
                className="w-full rounded-lg
                           bg-gray-50 dark:bg-gray-800
                           border border-gray-300 dark:border-gray-700
                           px-3 py-2 text-sm
                           text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg
                         bg-indigo-600 hover:bg-indigo-500
                         disabled:bg-gray-400 dark:disabled:bg-gray-700
                         disabled:cursor-not-allowed
                         text-sm font-medium text-white
                         py-2.5 transition-colors"
            >
              {loading ? "Ingresando..." : "Ingresar al Shop"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginClientePage;
