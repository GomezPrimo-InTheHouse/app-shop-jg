// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useCoupon } from "./CouponContext.jsx";
import { useNotification } from "./NotificationContext.jsx";

const CartContext = createContext(null);

const LS_CART = "jg_shop_cart";

/**
 * Formato de item dentro del carrito:
 * {
 *   id: number | string,
 *   nombre: string,
 *   precio: number,      // precio unitario REAL (precio_final si hay oferta)
 *   quantity: number,
 *   foto_url?: string
 * }
 */

// Precio que ve el cliente: precio_final (con oferta) si existe, si no precio.
const getPrecioVenta = (product) => {
  const final = Number(product?.precio_final);
  if (Number.isFinite(final) && final > 0) return final;
  return Number(product?.precio ?? product?.precio_unitario ?? 0) || 0;
};

const loadCart = () => {
  try {
    const raw = localStorage.getItem(LS_CART);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((i) => i && i.id != null && Number(i.quantity) > 0)
      : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { hasCuponAplicado, limpiarCupon } = useCoupon();
  const { showNotification } = useNotification();

  // 💾 Persistir carrito (sobrevive recargas y la vuelta desde WhatsApp/MP)
  useEffect(() => {
    try {
      localStorage.setItem(LS_CART, JSON.stringify(items));
    } catch {
      /* storage lleno o bloqueado: el carrito sigue funcionando en memoria */
    }
  }, [items]);

  // 👉 Agregar producto al carrito
  const addToCart = (product, quantity = 1) => {
    if (!product) return;

    const id = product.id ?? product.producto_id;
    if (id == null) return;

    setItems((prev) => {
      const exists = prev.find((i) => i.id === id);
      if (exists) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }

      return [
        ...prev,
        {
          id,
          nombre: product.nombre,
          precio: getPrecioVenta(product),
          quantity,
          foto_url: product.imagen_url ?? product.foto_url ?? product.image ?? null,
        },
      ];
    });

    setIsCartOpen(true); // al agregar, abrimos el drawer
  };

  // 👉 Cambiar cantidad (si llega a 0, se quita)
  const updateQuantity = (id, quantity) => {
    const q = Math.floor(Number(quantity) || 0);
    setItems((prev) =>
      q <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity: q } : i))
    );
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + (item.quantity || 0), 0),
    [items]
  );

  const totalAmount = useMemo(
    () =>
      items.reduce(
        (acc, item) => acc + (Number(item.precio) || 0) * (Number(item.quantity) || 0),
        0
      ),
    [items]
  );

  // 🎟️ El descuento del cupón se calcula sobre el total al validarlo.
  // Si el carrito cambia después, ese total queda viejo: limpiamos el cupón
  // para que el cliente lo vuelva a aplicar sobre el monto actual.
  const prevTotalRef = useRef(totalAmount);
  useEffect(() => {
    if (prevTotalRef.current !== totalAmount && hasCuponAplicado) {
      limpiarCupon();
      if (totalAmount > 0) {
        showNotification(
          "info",
          "Cambiaste el carrito: volvé a aplicar tu cupón para recalcular el descuento."
        );
      }
    }
    prevTotalRef.current = totalAmount;
  }, [totalAmount, hasCuponAplicado, limpiarCupon, showNotification]);

  // 👉 Formato para enviar al backend en /shop/ventas
  const itemsForBackend = useMemo(
    () => items.map((i) => ({ producto_id: i.id, cantidad: i.quantity })),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        totalItems,
        totalAmount,
        itemsForBackend,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);