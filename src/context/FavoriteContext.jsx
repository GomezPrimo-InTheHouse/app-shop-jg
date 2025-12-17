// src/context/FavoriteContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { getFavoritos, toggleFavorito } from "../api/favoritosApi";
import { useNotification } from "./NotificationContext";

const FavoriteContext = createContext(null);

const getBuyerFromStorage = () => {
  try {
    const raw = localStorage.getItem("jg_shop_buyer");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getClienteId = () => {
  const buyer = getBuyerFromStorage();
  const id = Number(buyer?.cliente?.id);
  return Number.isFinite(id) ? id : null;
};

const getDisplayPrice = (p) => {
  const pf = Number(p?.precio_final);
  if (Number.isFinite(pf) && pf > 0) return pf;
  const pr = Number(p?.precio);
  return Number.isFinite(pr) ? pr : 0;
};

export const FavoriteProvider = ({ children }) => {
  const { showNotification } = useNotification();

  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [favoriteProducts, setFavoriteProducts] = useState([]); // productos completos (para Mis Favoritos)
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [pendingById, setPendingById] = useState({}); // { [productId]: true }

  const clienteId = useMemo(() => getClienteId(), []);

  const isLoggedIn = useMemo(() => Number.isFinite(clienteId) && clienteId !== null, [clienteId]);

  const isFavorite = useCallback(
    (productId) => {
      const id = Number(productId);
      if (!Number.isFinite(id)) return false;
      return favoriteIds.has(id);
    },
    [favoriteIds]
  );

  const loadFavorites = useCallback(
    async (forcedClienteId) => {
      const cid = Number(forcedClienteId ?? getClienteId());
      if (!Number.isFinite(cid)) return;

      try {
        setLoadingFavorites(true);
        const data = await getFavoritos(cid);
        const items = Array.isArray(data?.items) ? data.items : [];

        const ids = new Set(items.map((it) => Number(it?.producto?.id)).filter(Number.isFinite));
        setFavoriteIds(ids);

        // guardamos productos completos (solo lo que viene)
        const prods = items
          .map((it) => it?.producto)
          .filter(Boolean)
          .map((p) => ({
            ...p,
            // normalizamos para UI
            precio: getDisplayPrice(p),
          }));
        setFavoriteProducts(prods);
      } catch (e) {
        showNotification("error", `No se pudieron cargar favoritos: ${e.message}`);
      } finally {
        setLoadingFavorites(false);
      }
    },
    [showNotification]
  );

  // Cargar al montar si hay sesión
  useEffect(() => {
    const cid = getClienteId();
    if (Number.isFinite(cid)) loadFavorites(cid);
  }, [loadFavorites]);

  const toggleFavorite = useCallback(
    async (productOrId) => {
      const cid = getClienteId();
      if (!Number.isFinite(cid)) {
        showNotification("info", "Para agregar favoritos debes iniciar sesion");
        return;
      }

      const product =
        typeof productOrId === "object" && productOrId !== null ? productOrId : null;

      const productId = Number(product?.id ?? productOrId);
      if (!Number.isFinite(productId)) return;

      const wasFav = favoriteIds.has(productId);

      // Optimistic: flip inmediato
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFav) next.delete(productId);
        else next.add(productId);
        return next;
      });

      // Optimistic: lista Mis Favoritos (si tenemos el producto a mano)
      if (!wasFav && product) {
        setFavoriteProducts((prev) => {
          const exists = prev.some((p) => Number(p?.id) === productId);
          if (exists) return prev;
          const normalized = { ...product, precio: getDisplayPrice(product) };
          return [normalized, ...prev];
        });
      }
      if (wasFav) {
        setFavoriteProducts((prev) => prev.filter((p) => Number(p?.id) !== productId));
      }

      setPendingById((prev) => ({ ...prev, [productId]: true }));

      try {
        const resp = await toggleFavorito(cid, productId);
        const serverFav = !!resp?.favorited;

        // Si el server difiere, lo alineamos
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (serverFav) next.add(productId);
          else next.delete(productId);
          return next;
        });

        if (serverFav) {
          showNotification("success", "Agregado a favoritos");
        } else {
          showNotification("success", "Eliminado de favoritos");
        }

        // Si el server dice que quedó favorito pero no teníamos producto en la lista,
        // recargamos favoritos para completar la data.
        if (serverFav && !product) {
          loadFavorites(cid);
        }
      } catch (e) {
        // Revertir
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (wasFav) next.add(productId);
          else next.delete(productId);
          return next;
        });

        // Revert lista
        if (!wasFav && product) {
          setFavoriteProducts((prev) => prev.filter((p) => Number(p?.id) !== productId));
        }
        if (wasFav && product) {
          setFavoriteProducts((prev) => {
            const exists = prev.some((p) => Number(p?.id) === productId);
            if (exists) return prev;
            const normalized = { ...product, precio: getDisplayPrice(product) };
            return [normalized, ...prev];
          });
        }

        showNotification("error", `No se pudo actualizar favoritos: ${e.message}`);
      } finally {
        setPendingById((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
      }
    },
    [favoriteIds, showNotification, loadFavorites]
  );

  const value = useMemo(
    () => ({
      favoriteIds,
      favoriteProducts,
      loadingFavorites,
      pendingById,
      isFavorite,
      loadFavorites,
      toggleFavorite,
    }),
    [favoriteIds, favoriteProducts, loadingFavorites, pendingById, isFavorite, loadFavorites, toggleFavorite]
  );

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
};

export const useFavorites = () => useContext(FavoriteContext);
