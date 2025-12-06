import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard.jsx";
import { fetchProductos } from "../../api/productsApi.js";
import StatusNotification from "../notification/StatusNotification.jsx";

const ProductGrid = () => {
  const [productos, setProductos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1) Cargar productos desde el backend
  useEffect(() => {
    const loadProductos = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchProductos();

        // Filtrar SOLO subir_web = true acá
        const productosWeb = data.filter((p) => p.subir_web === true);

        setProductos(productosWeb);
      } catch (err) {
        console.error(err);
        setError(
          "No pudimos obtener los productos. Probá recargar la página o volvé a intentar en unos minutos."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProductos();
  }, []);

  // 2) Categorías dinámicas según lo que viene del backend
  const categories = useMemo(() => {
    const cats = new Set();
    productos.forEach((p) => {
      if (p.categoria) cats.add(p.categoria);
    });
    return ["Todos", ...Array.from(cats)];
  }, [productos]);

  // 3) Filtro final según categoría + búsqueda
  const filteredProducts = useMemo(() => {
    return productos.filter((p) => {
      const matchCategory =
        selectedCategory === "Todos" || p.categoria === selectedCategory;

      const searchText = search.toLowerCase();
      const matchSearch =
        p.nombre.toLowerCase().includes(searchText) ||
        (p.descripcion || "").toLowerCase().includes(searchText);

      return matchCategory && matchSearch;
    });
  }, [productos, selectedCategory, search]);

  return (
    <div className="space-y-4">
      {/* Estado de carga / error */}
      {loading && (
        <StatusNotification
          variant="loading"
          message="Obteniendo productos de la tienda..."
          showSpinner
        />
      )}

      {error && !loading && (
        <StatusNotification variant="error" message={error} />
      )}

      {/* Filtros / buscador */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Categorías tipo pill */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border 
                ${
                  selectedCategory === cat
                    ? "border-neutral-100 bg-neutral-100 text-neutral-900"
                    : "border-neutral-700 text-neutral-300 hover:border-neutral-500"
                }
              transition-colors`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full bg-neutral-900 border border-neutral-700 
                       px-3 py-1.5 text-sm text-neutral-100
                       placeholder:text-neutral-500
                       focus:outline-none focus:border-neutral-300"
          />
        </div>
      </div>

      {/* Grid de productos */}
      {!loading && !error && filteredProducts.length === 0 && (
        <StatusNotification
          variant="info"
          message="No encontramos productos con esos filtros. Probá cambiando la búsqueda 😄"
          className="border-dashed"
        />
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
