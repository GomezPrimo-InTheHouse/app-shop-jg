// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  loginClienteApi,
  registrarSesionApi,
} from "../api/shopApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [cliente, setCliente] = useState(null);
  const [sesion, setSesion] = useState(null);
  const [loading, setLoading] = useState(false);

  // Podés persistir en localStorage si querés
  useEffect(() => {
    const stored = localStorage.getItem("shop_auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCliente(parsed.cliente || null);
      setSesion(parsed.sesion || null);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("shop_auth", JSON.stringify({ cliente, sesion }));
  }, [cliente, sesion]);

  const login = async (formData) => {
    setLoading(true);
    try {
      // 1) LOGIN
      const data = await loginClienteApi(formData);
      setCliente(data.cliente);

      // 2) SESIÓN
      const sesionResp = await registrarSesionApi({
        cliente_id: data.cliente.id,
        origen: "web_shop",
      });

      setSesion(sesionResp.sesion);

      return {
        cliente: data.cliente,
        cuponBienvenida: data.cupon_bienvenida || null,
        emailCuponEnviado: data.email_cupon_enviado || false,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCliente(null);
    setSesion(null);
    localStorage.removeItem("shop_auth");
  };

  return (
    <AuthContext.Provider
      value={{
        cliente,
        sesion,
        loading,
        login,
        logout,
        isLoggedIn: Boolean(cliente),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
