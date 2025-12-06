import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BACKEND,
  timeout: 50000,
});

// (Opcional) interceptor para loguear errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en la API:", error);
    throw error;
  }
);

export default apiClient;
