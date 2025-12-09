// src/context/AuthContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL_BACKEND; // https://local-app-back.onrender.com

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [cliente, setCliente] = useState(null);
  const [sesionId, setSesionId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 👉 login cliente shop
  const login = useCallback(
    async ({ nombre, apellido, dni, email }) => {
      setLoading(true);
      try {
        const { data } = await axios.post(`${API}/shop/login`, {
          nombre,
          apellido,
          dni,
          email: email || null,
        });

        const clienteResp = data?.cliente ?? null;
        setCliente(clienteResp);

        let nuevaSesionId = null;

        // Solo registramos sesión si el backend devolvió cliente con id
        if (clienteResp && clienteResp.id) {
          try {
            const { data: sesionData } = await axios.post(
              `${API}/shop/sesiones`,
              {
                cliente_id: clienteResp.id,
                origen: "web_shop",
              }
            );

            nuevaSesionId = sesionData?.sesion?.id ?? null;
            setSesionId(nuevaSesionId);
          } catch (err) {
            console.error("Error registrando sesión de cliente", err);
          }
        }

        // Adaptamos nombres a camelCase para el front
        const cuponBienvenida = data?.cupon_bienvenida ?? null;
        const emailCuponEnviado = data?.email_cupon_enviado ?? false;

        return {
          cliente: clienteResp,
          cuponBienvenida,
          emailCuponEnviado,
          sesionId: nuevaSesionId,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setCliente(null);
    setSesionId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        cliente,
        sesionId,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
