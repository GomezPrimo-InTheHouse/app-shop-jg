import { useEffect, useMemo, useState } from "react";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react"; 
import ProductCard from "./ProductCard.jsx";
import ProductSkeleton from "./ProductSkeleton.jsx"; // Necesario para la UX
import { fetchProductos } from "../../api/productsApi.js";
import StatusNotification from "../notification/StatusNotification.jsx";

// Constante para el número de placeholders del skeleton
const SKELETON_COUNT = 8; 

const ProductGrid = () => {
  const [productos, setProductos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // NUEVOS ESTADOS DE FILTRO
  const [minPriceFilter, setMinPriceFilter] = useState(0);
  const [maxPriceFilter, setMaxPriceFilter] = useState(Infinity);
  const [showFilters, setShowFilters] = useState(false); // Para ocultar/mostrar filtros en mobile

  // 1) Cargar productos desde el backend (Lógica Correcta)
  useEffect(() => {
    const loadProductos = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProductos();
        const productosWeb = data.filter((p) => p.subir_web === true);
        setProductos(productosWeb);
      } catch (err) {
        console.error(err);
        setError("No pudimos obtener los productos. Por favor, recargá la página.");
      } finally {
        setLoading(false);
      }
    };
    loadProductos();
  }, []);

  // 2) Cálculo Dinámico de Rangos y Categorías Disponibles (useMemo)
  const { categories, minAvailablePrice, maxAvailablePrice } = useMemo(() => {
    const cats = new Set();
    let min = Infinity;
    let max = 0;

    productos.forEach((p) => {
        // Asumiendo que p.price es un número y p.categoria es string
        if (p.price !== undefined && p.price !== null) {
            min = Math.min(min, p.price);
            max = Math.max(max, p.price);
        }
        if (p.categoria && typeof p.categoria === 'string' && p.categoria.trim() !== '') {
            // Primera letra en mayúscula para la UI
            cats.add(p.categoria.charAt(0).toUpperCase() + p.categoria.slice(1).toLowerCase());
        }
    });

    // Inicializar los filtros de precio del usuario en el primer cálculo
    if (productos.length > 0 && minPriceFilter === 0 && maxPriceFilter === Infinity) {
      setMinPriceFilter(min);
      setMaxPriceFilter(max);
    }
    
    return { 
        categories: ["Todos", ...Array.from(cats)],
        minAvailablePrice: min === Infinity ? 0 : min,
        maxAvailablePrice: max === 0 ? 0 : max,
    };
  }, [productos, minPriceFilter, maxPriceFilter]);


  // 3) Filtro final: Combina Categoría + Búsqueda + Rango de Precio
  const filteredProducts = useMemo(() => {
    // Usamos los valores exactos para la comparación
    const minP = parseFloat(minPriceFilter);
    const maxP = parseFloat(maxPriceFilter);

    return productos.filter((p) => {
      const displayCategory = p.categoria ? p.categoria.charAt(0).toUpperCase() + p.categoria.slice(1).toLowerCase() : '';
      const matchCategory =
        selectedCategory === "Todos" || displayCategory === selectedCategory;

      const searchText = search.toLowerCase();
      const matchSearch =
        p.nombre.toLowerCase().includes(searchText) ||
        (p.descripcion || "").toLowerCase().includes(searchText);

      // NUEVO: Lógica de filtro por precio
      const productPrice = p.price || 0;
      const matchPrice = productPrice >= minP && productPrice <= maxP;

      return matchCategory && matchSearch && matchPrice;
    });
  }, [productos, selectedCategory, search, minPriceFilter, maxPriceFilter]);

  // Función para resetear todos los filtros
  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("Todos");
    // Resetear al rango completo de precios disponibles
    setMinPriceFilter(minAvailablePrice);
    setMaxPriceFilter(maxAvailablePrice);
  };

  // El componente se hace más legible
  return (
    <div className="space-y-6">
      
      {/* Botón para mostrar/ocultar filtros en Mobile (UX) */}
      <div className="flex justify-between items-center sm:hidden">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Opciones de Filtro</h3>
        <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm 
                       bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
        >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="font-medium">Filtros</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : 'rotate-0'}`} />
        </button>
      </div>

      {/* BLOQUE PROFESIONAL DE FILTROS (Desktop y Mobile Colapsable) */}
      <div 
        className={`w-full grid transition-all duration-300 ease-in-out
                   sm:grid-cols-4 sm:gap-6 
                   ${showFilters ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 sm:opacity-100 sm:grid-rows-[1fr]'}
                   overflow-hidden
                  `}
      >
        
        {/* COLUMNA 1: Rango de Precios */}
        <div className="space-y-3 mb-4 sm:mb-0">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Rango de Precio
            </label>
            <div className="flex items-center gap-2 text-sm">
                <input
                    type="number"
                    value={minPriceFilter}
                    onChange={(e) => setMinPriceFilter(e.target.value)}
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
                    value={maxPriceFilter}
                    onChange={(e) => setMaxPriceFilter(e.target.value)}
                    min={minAvailablePrice}
                    max={maxAvailablePrice}
                    aria-label="Precio máximo"
                    placeholder={`Max. ${maxAvailablePrice.toFixed(2)}`}
                    className="w-1/2 p-2 rounded-lg text-center font-semibold 
                               bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Disponible: ${minAvailablePrice.toFixed(2)} - ${maxAvailablePrice.toFixed(2)}</p>
        </div>

        {/* COLUMNA 2-3: Filtros Rápidos (Categorías) */}
        <div className="space-y-3 sm:col-span-2 mb-4 sm:mb-0">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filtros Rápidos</h4>
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
        
        {/* COLUMNA 4: Buscador y Reset */}
        <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Búsqueda Rápida</h4>
             {/* Buscador (UX mejorado con iconos) */}
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
            
            {/* Botón de Reset */}
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

      {/* Separador visual antes del Grid */}
      <hr className="border-gray-200 dark:border-gray-800" />

      {/* ESTADO DE CARGA / ERROR / RESULTADOS */}
      {loading ? (
        // 1. Estado de carga con Skeletons (MEJORA UX)
        <>
        <StatusNotification
          variant="loading"
          message="Obteniendo productos de la tienda..."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <ProductSkeleton key={index} />
            ))}
        </div>
        </>
      ) : error ? (
        // 2. Estado de error
        <StatusNotification variant="error" message={error} />
      ) : filteredProducts.length === 0 ? (
        // 3. Sin resultados
        <StatusNotification
          variant="info"
          message="No encontramos productos que coincidan con los filtros aplicados. Probá ajustando el rango de precio, la búsqueda o la categoría."
        />
      ) : (
        // 4. Grid de productos
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;