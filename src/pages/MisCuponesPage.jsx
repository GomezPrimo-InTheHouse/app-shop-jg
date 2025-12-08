// src/pages/MisCuponesPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { obtenerCuponesClienteApi } from "../api/shopApi";
import ShopHeader from "../components/layout/ShopHeader";

const getBadgeClasses = (estadoNombre) => {
  const base =
    "px-2 py-0.5 rounded-full text-[11px] font-medium border";

  switch (estadoNombre) {
    case "ACTIVO":
      return `${base} bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700`;
    case "USADO":
      return `${base} bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700`;
    case "VENCIDO":
      return `${base} bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700`;
    default:
      return `${base} bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700`;
  }
};

const MisCuponesPage = () => {
  const { cliente } = useAuth();
  const { showNotification } = useNotification();
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCupones = async () => {
      if (!cliente) return;
      setLoading(true);
      try {
        const data = await obtenerCuponesClienteApi(cliente.id);
        setCupones(data || []);
      } catch (error) {
        console.error(error);
        showNotification("error", "No se pudieron cargar tus cupones.");
      } finally {
        setLoading(false);
      }
    };

    fetchCupones();
  }, [cliente, showNotification]);

  if (!cliente) {
    return (
      <div
        className="min-h-screen flex items-center justify-center
                   bg-gray-100 dark:bg-gray-900
                   text-gray-600 dark:text-gray-300"
      >
        Iniciá sesión para ver tus cupones.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col
                 bg-gray-100 dark:bg-gray-900
                 text-gray-900 dark:text-gray-100
                 transition-colors duration-500"
    >
      <ShopHeader />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-2">Mis cupones</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Consultá todos los cupones activos, usados y vencidos.
          </p>

          {loading ? (
            <div className="text-gray-600 dark:text-gray-300">
              Cargando cupones...
            </div>
          ) : cupones.length === 0 ? (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              No tenés cupones asignados por el momento.
            </div>
          ) : (
            <div className="space-y-3">
              {cupones.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-gray-200 dark:border-gray-800
                             bg-white/70 dark:bg-gray-950/70
                             backdrop-blur-sm p-4
                             flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Código
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-md
                                   bg-gray-100 dark:bg-gray-800
                                   border border-gray-300 dark:border-gray-700
                                   text-xs font-mono
                                   text-gray-800 dark:text-gray-100"
                      >
                        {c.codigo}
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 text-xs">
                      {c.descripcion}
                    </p>

                    <div className="flex flex-wrap gap-3 text-[11px] text-gray-600 dark:text-gray-400">
                      {c.descuento_porcentaje && (
                        <span>
                          Descuento:{" "}
                          <strong>{c.descuento_porcentaje}%</strong>
                        </span>
                      )}
                      {c.descuento_monto && (
                        <span>
                          Descuento: $
                          {Number(c.descuento_monto).toLocaleString(
                            "es-AR"
                          )}
                        </span>
                      )}
                      <span>
                        Uso: {c.usos_realizados}/{c.uso_maximo}
                      </span>
                      {c.valido_desde && c.valido_hasta && (
                        <span>
                          Vigencia:{" "}
                          {new Date(c.valido_desde).toLocaleDateString(
                            "es-AR"
                          )}{" "}
                          -{" "}
                          {new Date(c.valido_hasta).toLocaleDateString(
                            "es-AR"
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                    <span className={getBadgeClasses(c.estado_nombre)}>
                      {c.estado_nombre}
                    </span>
                    {c.email_destino && (
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        Enviado a: {c.email_destino}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MisCuponesPage;
