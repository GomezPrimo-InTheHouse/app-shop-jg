// src/api/favoritosApi.js
const API = import.meta.env.VITE_API_URL_BACKEND;

async function requestJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

export const getFavoritos = (clienteId) =>
  requestJSON(`${API}/shop/clientes/${clienteId}/favoritos`, { method: "GET" });

export const addFavorito = (clienteId, productoId) =>
  requestJSON(`${API}/shop/clientes/${clienteId}/favoritos`, {
    method: "POST",
    body: JSON.stringify({ producto_id: productoId }),
  });

export const removeFavorito = (clienteId, productoId) =>
  requestJSON(`${API}/shop/clientes/${clienteId}/favoritos/${productoId}`, {
    method: "DELETE",
  });

export const toggleFavorito = (clienteId, productoId) =>
  requestJSON(`${API}/shop/clientes/${clienteId}/favoritos/toggle`, {
    method: "POST",
    body: JSON.stringify({ producto_id: productoId }),
  });
