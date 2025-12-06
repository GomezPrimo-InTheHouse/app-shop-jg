import apiClient from "./axiosClient";

export const fetchProductos = async () => {
  const response = await apiClient.get("/producto/");
  const payload = response.data;

  if (!payload?.success || !Array.isArray(payload.data)) {
    throw new Error("Respuesta inválida del servidor");
  }

  // Acá devolvemos el array de productos tal cual viene
  return payload.data;
};
