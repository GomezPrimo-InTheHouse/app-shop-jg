// src/context/CartContext.jsx
import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

/**
 * Formato de item dentro del carrito:
 * {
 *   id: number | string,
 *   nombre: string,
 *   precio: number,
 *   quantity: number,
 *   foto_url?: string
 * }
 */

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 👉 Agregar producto al carrito
  const addToCart = (product, quantity = 1) => {
    if (!product) return;

    // Aseguramos un id consistente (según cómo venga del backend/front)
    const id = product.id ?? product.producto_id;
    if (!id) return;

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
          precio: Number(product.precio ?? product.precio_unitario ?? 0),
          quantity,
          foto_url:
            product.imagen_url ??
            product.foto_url ??
            product.image ??
            null,
        },
      ];
    });

    setIsCartOpen(true); // al agregar, abrimos el drawer
  };

  // 👉 Eliminar un item
  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // 👉 Vaciar carrito
  const clearCart = () => setItems([]);

  // 👉 Control del drawer
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // 👉 Total de ítems (para el header / badge)
  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + (item.quantity || 0), 0),
    [items]
  );

  // 👉 Total en pesos (para header y footer del drawer)
  const totalAmount = useMemo(
    () =>
      items.reduce(
        (acc, item) =>
          acc +
          (Number(item.precio) || 0) * (Number(item.quantity) || 0),
        0
      ),
    [items]
  );

  // 👉 Formato especial para enviar al backend en /shop/ventas
  const itemsForBackend = useMemo(
    () =>
      items.map((i) => ({
        producto_id: i.id,
        cantidad: i.quantity,
      })),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
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
