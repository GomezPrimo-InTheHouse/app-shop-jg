import { useEffect, useMemo, useState } from "react";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import ProductCard from "./ProductCard.jsx";
import ProductSkeleton from "./ProductSkeleton.jsx";
import { fetchProductos } from "../../api/productsApi.js";
import StatusNotification from "../notification/StatusNotification.jsx";

const SKELETON_COUNT = 8;

const ProductGrid = () => {
  const [productos, setProductos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [minPriceFilter, setMinPriceFilter] = useState(null);
  const [maxPriceFilter, setMaxPriceFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Cálculo dinámico de categorías y rangos
  const { categories, minAvailablePrice, maxAvailablePrice } = useMemo(() => {
    const cats = new Set();
    let min = Infinity;
    let max = 0;

    productos.forEach((p) => {
      if (p.price !== undefined && p.price !== null) {
        min = Math.min(min, p.price);
        max = Math.max(max, p.price);
      }

      if (p.categoria && typeof p.categoria === "string" && p.categoria.trim() !== "") {
        cats.add(
          p.categoria.charAt(0).toUpperCase() +
            p.categoria.slice(1).toLowerCase()
        );
      }
    });

    return {
      categories: ["Todos", ...Array.from(cats)],
      minAvailablePrice: min === Infinity ? 0 : min,
      maxAvailablePrice: max === 0 ? 0 : max,
    };
  }, [productos]);

  // Carga de productos + inicialización de filtros de precio
  useEffect(() => {
    const loadProductos = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProductos();
        const productosWeb = data.filter((p) => p.subir_web === true);
        setProductos(productosWeb);

        if (productosWeb.length > 0) {
          let minP = Infinity;
          let maxP = 0;
          productosWeb.forEach((p) => {
            if (p.price !== undefined && p.price !== null) {
              minP = Math.min(minP, p.price);
              maxP = Math.max(maxP, p.price);
            }
          });
          setMinPriceFilter(minP === Infinity ? 0 : minP);
          setMaxPriceFilter(maxP === 0 ? 0 : maxP);
        } else {
          setMinPriceFilter(0);
          setMaxPriceFilter(0);
        }
      } catch (err) {
        console.error(err);
        setError(
          "No pudimos obtener los productos. Por favor, recargá la página."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProductos();
  }, []);

  // Filtro final
  const filteredProducts = useMemo(() => {
    if (minPriceFilter === null || maxPriceFilter === null) return productos;

    const minP = Number(minPriceFilter);
    const maxP = Number(maxPriceFilter);

    return productos.filter((p) => {
      const displayCategory = p.categoria
        ? p.categoria.charAt(0).toUpperCase() +
          p.categoria.slice(1).toLowerCase()
        : "";

      const matchCategory =
        selectedCategory === "Todos" || displayCategory === selectedCategory;

      const searchText = search.toLowerCase();
      const matchSearch =
        p.nombre.toLowerCase().includes(searchText) ||
        (p.descripcion || "").toLowerCase().includes(searchText);

      const productPrice = p.price || 0;
      const matchPrice = productPrice >= minP && productPrice <= maxP;

      return matchCategory && matchSearch && matchPrice;
    });
  }, [productos, selectedCategory, search, minPriceFilter, maxPriceFilter]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("Todos");
    setMinPriceFilter(minAvailablePrice);
    setMaxPriceFilter(maxAvailablePrice);
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value === "" ? 0 : Number(e.target.value);
    setMinPriceFilter(value);
  };

  const handleMaxPriceChange = (e) => {
    const value =
      e.target.value === "" ? maxAvailablePrice : Number(e.target.value);
    setMaxPriceFilter(value);
  };

  return (
    <div className="pt-2">
      {/* Header filtros mobile */}
      <div className="flex justify-between items-center sm:hidden mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
          Opciones de Filtro
        </h3>
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm 
                     bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="font-medium">Filtros</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              showFilters ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>

      {/* BLOQUE DE FILTROS 
          - Mobile: hidden cuando showFilters = false (no ocupa espacio).
          - Desktop: siempre visible como grid.
      */}
      <div
        className={`
          w-full transition-all duration-300 ease-in-out
          ${showFilters ? "grid gap-4" : "hidden"}
          sm:grid sm:grid-cols-4 sm:gap-6
        `}
      >
        {/* Columna 1: Rango de precios */}
        <div className="space-y-3 mb-4 sm:mb-0">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Rango de Precio
          </label>
          <div className="flex items-center gap-2 text-sm">
            <input
              type="number"
              value={minPriceFilter === null ? "" : minPriceFilter}
              onChange={handleMinPriceChange}
              min={minAvailablePrice}
              max={maxAvailablePrice}
              aria-label="Precio mínimo"
              placeholder={`Min. ${minAvailablePrice.toFixed(2)}`}
              className="w-1/2 p-2 rounded-lg text-center font-semibold 
                         bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
            <span className="text-gray-500 dark:text-gray-400">a</span>
            <input
              type="number"
              value={maxPriceFilter === null ? "" : maxPriceFilter}
              onChange={handleMaxPriceChange}
              min={minAvailablePrice}
              max={maxAvailablePrice}
              aria-label="Precio máximo"
              placeholder={`Max. ${maxAvailablePrice.toFixed(2)}`}
              className="w-1/2 p-2 rounded-lg text-center font-semibold 
                         bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            Disponible: ${minAvailablePrice.toFixed(2)} - $
            {maxAvailablePrice.toFixed(2)}
          </p>
        </div>

        {/* Columnas 2-3: Categorías */}
        <div className="space-y-3 sm:col-span-2 mb-4 sm:mb-0">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Filtros Rápidos
          </h4>
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filtrar por categoría de producto"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                role="tab"
                aria-selected={selectedCategory === cat}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap 
                  ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white dark:bg-indigo-500 dark:text-gray-900 shadow-md"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Columna 4: búsqueda y reset */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Búsqueda Rápida
          </h4>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Campo de búsqueda de productos"
              className="w-full rounded-full 
                         bg-gray-100 dark:bg-gray-800 
                         border border-gray-300 dark:border-gray-700 
                         pl-10 pr-10 py-2 text-sm 
                         text-gray-900 dark:text-gray-100
                         placeholder:text-gray-500
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            onClick={handleResetFilters}
            className="w-full py-2 px-4 rounded-full text-sm font-medium transition-colors
                       bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400
                       hover:bg-red-100 dark:hover:bg-red-800/40"
          >
            Limpiar todos los filtros
          </button>
        </div>
      </div>

      {/* Separador */}
      <div className="mt-4 sm:mt-6 sm:mb-4">
        <hr className="border-gray-200 dark:border-gray-800" />
      </div>

      {/* Contenido principal: grid de productos / estados */}
      {loading ? (
        <>
          <StatusNotification
            variant="loading"
            message="Obteniendo productos de la tienda..."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </>
      ) : error ? (
        <StatusNotification variant="error" message={error} />
      ) : filteredProducts.length === 0 &&
        minPriceFilter !== null &&
        maxPriceFilter !== null ? (
        <StatusNotification
          variant="info"
          message="No encontramos productos que coincidan con los filtros aplicados. Probá ajustando el rango de precio, la búsqueda o la categoría."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
