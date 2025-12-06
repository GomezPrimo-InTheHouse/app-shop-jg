import ShopHeader from "../components/layout/ShopHeader.jsx";
import ProductGrid from "../components/products/ProductGrid.jsx";

const ShopHome = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <ShopHeader />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
          {/* Encabezado de la página */}
          <section className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Tienda JG Informática
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl">
              Acá podés ver una selección de productos que tenemos disponibles en el local:
              cargadores, cables, parlantes, accesorios y más. Los precios pueden variar
              según stock y promociones vigentes en el negocio físico.
            </p>
          </section>

          {/* Bloque principal: filtros + grid */}
          <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm sm:text-base font-medium text-neutral-200">
                Productos disponibles
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-400">
                Vista previa online · Consultá stock por WhatsApp
              </p>
            </div>

            <ProductGrid />
          </section>
        </div>
      </main>
    </div>
  );
};

export default ShopHome;
