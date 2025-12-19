// // src/context/FavoriteContext.jsx
// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { getFavoritos, toggleFavorito } from "../api/favoritosApi";
// import { useNotification } from "./NotificationContext";
// import { useAuth } from "./AuthContext";


// const getBuyerFromStorage = () => {
//   try {
//     const raw = localStorage.getItem("jg_shop_buyer");
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// };

// const getClienteId = () => {
//   const buyer = getBuyerFromStorage();
//   const id = Number(buyer?.cliente?.id);
//   return Number.isFinite(id) ? id : null;
// };

// const getDisplayPrice = (p) => {
//   const pf = Number(p?.precio_final);
//   if (Number.isFinite(pf) && pf > 0) return pf;
//   const pr = Number(p?.precio);
//   return Number.isFinite(pr) ? pr : 0;
// };

// export const FavoriteProvider = ({ children }) => {
//   const { showNotification } = useNotification();

//   const { cliente } = useAuth();
//   const clienteId = cliente?.id ?? null;

//   // const [clienteId, setClienteId] = useState(() => getClienteId());

//   const [favoriteIds, setFavoriteIds] = useState(() => new Set());
//   const [favoriteProducts, setFavoriteProducts] = useState([]);
//   const [loadingFavorites, setLoadingFavorites] = useState(false);
//   const [pendingById, setPendingById] = useState({});

//   useEffect(() => {
//     if (Number.isFinite(clienteId)) {
//       // LOGIN → cargar favoritos
//       loadFavorites(clienteId);
//     } else {
//       // LOGOUT → limpiar estado local
//       setFavoriteIds(new Set());
//       setFavoriteProducts([]);
//     }
//   }, [clienteId, loadFavorites]);


//   // ✅ se actualiza cuando cambia el storage
//   useEffect(() => {
//     const sync = () => setClienteId(getClienteId());

//     window.addEventListener("storage", sync);
//     window.addEventListener("jg_shop_buyer_changed", sync);

//     return () => {
//       window.removeEventListener("storage", sync);
//       window.removeEventListener("jg_shop_buyer_changed", sync);
//     };
//   }, []);

//   const isFavorite = useCallback(
//     (productId) => {
//       const id = Number(productId);
//       if (!Number.isFinite(id)) return false;
//       return favoriteIds.has(id);
//     },
//     [favoriteIds]
//   );

//   const loadFavorites = useCallback(
//     async (forcedClienteId) => {
//       const cid = Number(forcedClienteId ?? getClienteId());
//       if (!Number.isFinite(cid)) return;

//       try {
//         setLoadingFavorites(true);
//         const data = await getFavoritos(cid);
//         const items = Array.isArray(data?.items) ? data.items : [];

//         const ids = new Set(
//           items.map((it) => Number(it?.producto?.id)).filter(Number.isFinite)
//         );
//         setFavoriteIds(ids);

//         const prods = items
//           .map((it) => it?.producto)
//           .filter(Boolean)
//           .map((p) => ({
//             ...p,
//             precio: getDisplayPrice(p),
//           }));

//         setFavoriteProducts(prods);
//       } catch (e) {
//         showNotification("error", `No se pudieron cargar favoritos: ${e.message}`);
//       } finally {
//         setLoadingFavorites(false);
//       }
//     },
//     [showNotification]
//   );

//   // ✅ clave: reacciona al login/logout
//   useEffect(() => {
//     if (!Number.isFinite(clienteId)) {
//       setFavoriteIds(new Set());
//       setFavoriteProducts([]);
//       setPendingById({});
//       setLoadingFavorites(false);
//       return;
//     }
//     loadFavorites(clienteId);
//   }, [clienteId, loadFavorites]);

//   const toggleFavorite = useCallback(
//     async (productOrId) => {
//       const cid = getClienteId();
//       if (!Number.isFinite(clienteId)) {
//         showNotification("info", "Para agregar favoritos debes iniciar sesión");
//         return;
//       }


//       const product =
//         typeof productOrId === "object" && productOrId !== null ? productOrId : null;

//       const productId = Number(product?.id ?? productOrId);
//       if (!Number.isFinite(productId)) return;

//       const wasFav = favoriteIds.has(productId);

//       // optimistic ids
//       setFavoriteIds((prev) => {
//         const next = new Set(prev);
//         if (wasFav) next.delete(productId);
//         else next.add(productId);
//         return next;
//       });

//       // optimistic list
//       if (!wasFav && product) {
//         setFavoriteProducts((prev) => {
//           const exists = prev.some((p) => Number(p?.id) === productId);
//           if (exists) return prev;
//           return [{ ...product, precio: getDisplayPrice(product) }, ...prev];
//         });
//       }
//       if (wasFav) {
//         setFavoriteProducts((prev) => prev.filter((p) => Number(p?.id) !== productId));
//       }

//       setPendingById((prev) => ({ ...prev, [productId]: true }));

//       try {
//         const resp = await toggleFavorito(cid, productId);
//         const serverFav = !!resp?.favorited;

//         setFavoriteIds((prev) => {
//           const next = new Set(prev);
//           if (serverFav) next.add(productId);
//           else next.delete(productId);
//           return next;
//         });

//         if (serverFav) showNotification("success", "Agregado a favoritos");
//         else showNotification("success", "Eliminado de favoritos");

//         // si quedó favorito y no teníamos producto, recargar
//         if (serverFav && !product) loadFavorites(cid);
//       } catch (e) {
//         // revert ids
//         setFavoriteIds((prev) => {
//           const next = new Set(prev);
//           if (wasFav) next.add(productId);
//           else next.delete(productId);
//           return next;
//         });

//         // revert list
//         if (!wasFav && product) {
//           setFavoriteProducts((prev) => prev.filter((p) => Number(p?.id) !== productId));
//         }
//         if (wasFav && product) {
//           setFavoriteProducts((prev) => {
//             const exists = prev.some((p) => Number(p?.id) === productId);
//             if (exists) return prev;
//             return [{ ...product, precio: getDisplayPrice(product) }, ...prev];
//           });
//         }

//         showNotification("error", `No se pudo actualizar favoritos: ${e.message}`);
//       } finally {
//         setPendingById((prev) => {
//           const next = { ...prev };
//           delete next[productId];
//           return next;
//         });
//       }
//     },
//     [favoriteIds, showNotification, loadFavorites]
//   );

//   const value = useMemo(
//     () => ({
//       clienteId,
//       favoriteIds,
//       favoriteProducts,
//       loadingFavorites,
//       pendingById,
//       isFavorite,
//       loadFavorites,
//       toggleFavorite,
//     }),
//     [
//       clienteId,
//       favoriteIds,
//       favoriteProducts,
//       loadingFavorites,
//       pendingById,
//       isFavorite,
//       loadFavorites,
//       toggleFavorite,
//     ]
//   );

//   return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
// };

// export const useFavorites = () => useContext(FavoriteContext);
// src/context/FavoriteContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getFavoritos, toggleFavorito } from "../api/favoritosApi";
import { useNotification } from "./NotificationContext";
import { useAuth } from "./AuthContext";

const FavoriteContext = createContext(null);

// 🔹 normaliza precio para UI
const getDisplayPrice = (p) => {
  const pf = Number(p?.precio_final);
  if (Number.isFinite(pf) && pf > 0) return pf;
  const pr = Number(p?.precio);
  return Number.isFinite(pr) ? pr : 0;
};

export const FavoriteProvider = ({ children }) => {
  const { showNotification } = useNotification();
  const { cliente } = useAuth();

  const clienteId = Number(cliente?.id) || null;

  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [pendingById, setPendingById] = useState({});

  // ✅ cargar favoritos desde backend
  const loadFavorites = useCallback(
    async (cid) => {
      if (!Number.isFinite(cid)) return;

      try {
        setLoadingFavorites(true);

        const data = await getFavoritos(cid);
        const items = Array.isArray(data?.items) ? data.items : [];

        // ids
        const ids = new Set(
          items
            .map((it) => Number(it?.producto?.id))
            .filter(Number.isFinite)
        );
        setFavoriteIds(ids);

        // productos completos
        const products = items
          .map((it) => it?.producto)
          .filter(Boolean)
          .map((p) => ({
            ...p,
            precio: getDisplayPrice(p),
          }));

        setFavoriteProducts(products);
      } catch (e) {
        showNotification(
          "error",
          `No se pudieron cargar favoritos: ${e.message}`
        );
      } finally {
        setLoadingFavorites(false);
      }
    },
    [showNotification]
  );

  // ✅ EFECTO CLAVE: login / logout
  useEffect(() => {
    if (Number.isFinite(clienteId)) {
      // LOGIN
      loadFavorites(clienteId);
    } else {
      // LOGOUT
      setFavoriteIds(new Set());
      setFavoriteProducts([]);
      setPendingById({});
      setLoadingFavorites(false);
    }
  }, [clienteId, loadFavorites]);

  // 🔹 helper
  const isFavorite = useCallback(
    (productId) => {
      const id = Number(productId);
      return Number.isFinite(id) && favoriteIds.has(id);
    },
    [favoriteIds]
  );

  // ❤️ toggle favorito (optimistic)
  const toggleFavorite = useCallback(
    async (productOrId) => {
      if (!Number.isFinite(clienteId)) {
        showNotification("info", "Para agregar favoritos debes iniciar sesión");
        return;
      }

      const product =
        typeof productOrId === "object" && productOrId !== null
          ? productOrId
          : null;

      const productId = Number(product?.id ?? productOrId);
      if (!Number.isFinite(productId)) return;

      const wasFav = favoriteIds.has(productId);

      // optimistic ids
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        wasFav ? next.delete(productId) : next.add(productId);
        return next;
      });

      // optimistic list
      if (!wasFav && product) {
        setFavoriteProducts((prev) => {
          if (prev.some((p) => Number(p.id) === productId)) return prev;
          return [{ ...product, precio: getDisplayPrice(product) }, ...prev];
        });
      }

      if (wasFav) {
        setFavoriteProducts((prev) =>
          prev.filter((p) => Number(p.id) !== productId)
        );
      }

      setPendingById((prev) => ({ ...prev, [productId]: true }));

      try {
        const resp = await toggleFavorito(clienteId, productId);
        const serverFav = !!resp?.favorited;

        // reconciliar con backend
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          serverFav ? next.add(productId) : next.delete(productId);
          return next;
        });

        showNotification(
          "success",
          serverFav ? "Agregado a favoritos" : "Eliminado de favoritos"
        );

        if (serverFav && !product) {
          loadFavorites(clienteId);
        }
      } catch (e) {
        // revert
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          wasFav ? next.add(productId) : next.delete(productId);
          return next;
        });

        showNotification(
          "error",
          `No se pudo actualizar favoritos: ${e.message}`
        );
      } finally {
        setPendingById((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
      }
    },
    [clienteId, favoriteIds, loadFavorites, showNotification]
  );

  const value = useMemo(
    () => ({
      clienteId,
      favoriteIds,
      favoriteProducts,
      loadingFavorites,
      pendingById,
      isFavorite,
      toggleFavorite,
      loadFavorites,
    }),
    [
      clienteId,
      favoriteIds,
      favoriteProducts,
      loadingFavorites,
      pendingById,
      isFavorite,
      toggleFavorite,
      loadFavorites,
    ]
  );

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoriteContext);
  if (!ctx) {
    throw new Error("useFavorites debe usarse dentro de <FavoriteProvider />");
  }
  return ctx;
};
