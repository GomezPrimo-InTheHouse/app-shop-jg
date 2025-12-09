// src/pages/ConfirmacionCompraPage.jsx
import { useLocation, Link } from "react-router-dom";
import ShopHeader from "../components/layout/ShopHeader.jsx";

const ConfirmacionCompraPage = () => {
  const location = useLocation();
  const { venta, detalles, total_bruto, descuento, total_final } =
    location.state || {};

  const formatPrice = (value) =>
    Number(value ?? 0).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });

  const tieneDatos = !!venta;

  return (
    <div
      className="min-h-screen flex flex-col
                 bg-gray-100 dark:bg-gray-900
                 text-gray-900 dark:text-gray-100
                 transition-colors duration-500"
    >
      <ShopHeader />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <h1 className="text-2xl font-semibold">
            {tieneDatos ? "¡Gracias por tu compra!" : "Compra registrada"}
          </h1>

          {tieneDatos ? (
            <section
              className="rounded-2xl border border-gray-200 dark:border-gray-800
                         bg-white/80 dark:bg-gray-950/80
                         backdrop-blur-sm p-4 sm:p-6 space-y-4 shadow-lg"
            >
              <div className="space-y-1 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  Número de pedido:{" "}
                  <span className="font-semibold">#{venta.id}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Fecha:{" "}
                  {venta.fecha
                    ? new Date(venta.fecha).toLocaleString("es-AR")
                    : "-"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Canal: {venta.canal || "web_shop"}
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(total_bruto)}</span>
                </div>

                {descuento > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Descuento</span>
                    <span>-{formatPrice(descuento)}</span>
                  </div>
                )}

                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formatPrice(total_final)}</span>
                </div>
              </div>

              {Array.isArray(detalles) && detalles.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <h2 className="text-sm font-semibold mb-2">
                    Detalle de productos
                  </h2>
                  <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                    {detalles.map((d) => (
                      <li
                        key={d.id}
                        className="flex justify-between gap-2"
                      >
                        <span>
                          ID producto: {d.producto_id}{" "}
                          <span className="text-gray-500 dark:text-gray-400">
                            x{d.cantidad}
                          </span>
                        </span>
                        <span>
                          {formatPrice(
                            Number(d.subtotal ?? 0)
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                Nos vamos a comunicar con vos para coordinar el{" "}
                <span className="font-semibold">
                  método de pago y entrega
                </span>
                .
              </p>
            </section>
          ) : (
            <section
              className="rounded-2xl border border-gray-200 dark:border-gray-800
                         bg-white/80 dark:bg-gray-950/80
                         backdrop-blur-sm p-4 sm:p-6 text-sm text-gray-700 dark:text-gray-300"
            >
              <p>
                Tu compra fue registrada, pero no encontramos el detalle
                completo en esta vista.
              </p>
              <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                Si recargaste la página, es posible que se haya perdido la
                información temporal. Podés ver tus compras o consultar
                directamente por WhatsApp.
              </p>
            </section>
          )}

          <div className="flex gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center
                         rounded-full border border-gray-300 dark:border-gray-700
                         bg-white dark:bg-gray-900
                         px-4 py-2 text-sm font-medium
                         text-gray-800 dark:text-gray-100
                         hover:bg-gray-100 dark:hover:bg-gray-800
                         transition-colors"
            >
              ← Volver a la tienda
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmacionCompraPage;
