// // src/context/AuthContext.jsx
// import { createContext, useContext, useState, useCallback } from "react";
// import axios from "axios";

// const API = import.meta.env.VITE_API_URL_BACKEND; // https://local-app-back.onrender.com

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [cliente, setCliente] = useState(null);
//   const [sesionId, setSesionId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // 👉 login cliente shop
//   const login = useCallback(
//     async ({ nombre, apellido, dni, email }) => {
//       setLoading(true);
//       try {
//         const { data } = await axios.post(`${API}/shop/login`, {
//           nombre,
//           apellido,
//           dni,
//           email: email || null,
//         });

//         const clienteResp = data?.cliente ?? null;
//         setCliente(clienteResp);

//         let nuevaSesionId = null;

//         // Solo registramos sesión si el backend devolvió cliente con id
//         if (clienteResp && clienteResp.id) {
//           try {
//             const { data: sesionData } = await axios.post(
//               `${API}/shop/sesiones`,
//               {
//                 cliente_id: clienteResp.id,
//                 origen: "web_shop",
//               }
//             );

//             nuevaSesionId = sesionData?.sesion?.id ?? null;
//             setSesionId(nuevaSesionId);
//           } catch (err) {
//             console.error("Error registrando sesión de cliente", err);
//           }
//         }

//         // Adaptamos nombres a camelCase para el front
//         const cuponBienvenida = data?.cupon_bienvenida ?? null;
//         const emailCuponEnviado = data?.email_cupon_enviado ?? false;

//         return {
//           cliente: clienteResp,
//           cuponBienvenida,
//           emailCuponEnviado,
//           sesionId: nuevaSesionId,
//         };
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   const logout = useCallback(() => {
//     setCliente(null);
//     setSesionId(null);
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         cliente,
//         sesionId,
//         loading,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginShopApi } from "../api/shopApi";
import { useNotification } from "./NotificationContext";

const AuthContext = createContext(null);

const LS_KEY = "jg_shop_buyer"; // guarda comprador + estado shop

export const AuthProvider = ({ children }) => {
  const { showNotification } = useNotification();

  const [cliente, setCliente] = useState(null);
  const [sesionId, setSesionId] = useState(null); // lo podés seguir usando (si lo necesitás)
  const [loading, setLoading] = useState(false);

  // ✅ NUEVO estado shop
  const [canalCliente, setCanalCliente] = useState(null);
  const [cuponActivo, setCuponActivo] = useState(null);
  const [cuponFlags, setCuponFlags] = useState({
    cupon_creado: false,
    cupon_bloqueado: false,
    cupon_next_available_at: null,
    cupon_block_reason: null,
  });

  // 🔁 hidratar desde localStorage
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);

      setCliente(parsed?.cliente ?? null);
      setCanalCliente(parsed?.canal_cliente ?? null);
      setCuponActivo(parsed?.cupon_activo ?? null);
      setCuponFlags({
        cupon_creado: !!parsed?.cupon_creado,
        cupon_bloqueado: !!parsed?.cupon_bloqueado,
        cupon_next_available_at: parsed?.cupon_next_available_at ?? null,
        cupon_block_reason: parsed?.cupon_block_reason ?? null,
      });
    } catch {
      localStorage.removeItem(LS_KEY);
    }
  }, []);

  // 💾 persistir comprador + estado shop
  useEffect(() => {
    const payload = {
      cliente,
      canal_cliente: canalCliente,
      cupon_activo: cuponActivo,
      ...cuponFlags,
    };

    if (cliente) localStorage.setItem(LS_KEY, JSON.stringify(payload));
    else localStorage.removeItem(LS_KEY);
  }, [cliente, canalCliente, cuponActivo, cuponFlags]);

  // ✅ LOGIN nuevo: identificación
  const login = async ({ nombre, apellido, dni, email }) => {
    setLoading(true);
    try {
      const data = await loginShopApi({ nombre, apellido, dni, email });

      setCliente(data?.cliente ?? null);
      setCanalCliente(data?.canal_cliente ?? null);
      setCuponActivo(data?.cupon_activo ?? null);
      setCuponFlags({
        cupon_creado: !!data?.cupon_creado,
        cupon_bloqueado: !!data?.cupon_bloqueado,
        cupon_next_available_at: data?.cupon_next_available_at ?? null,
        cupon_block_reason: data?.cupon_block_reason ?? null,
      });

      // UX: mensajes claros
      if (data?.cupon_activo?.codigo) {
        showNotification(
          "success",
          `🎁 Cupón disponible: ${data.cupon_activo.codigo} (${data.cupon_activo.descuento_porcentaje}% OFF)`
        );
      } else if (data?.cupon_bloqueado) {
        showNotification(
          "info",
          data?.cupon_block_reason ||
            "Ya utilizaste tu beneficio. Volvé a intentarlo más adelante."
        );
      } else {
        showNotification("success", "Identificación exitosa. ¡Ya podés comprar!");
      }

      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "No se pudo identificar al comprador.";
      showNotification("error", msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCliente(null);
    setSesionId(null);
    setCanalCliente(null);
    setCuponActivo(null);
    setCuponFlags({
      cupon_creado: false,
      cupon_bloqueado: false,
      cupon_next_available_at: null,
      cupon_block_reason: null,
    });
  };

  const value = useMemo(
    () => ({
      cliente,
      sesionId,
      loading,
      login,
      logout,

      // ✅ NUEVO (lo que pide tu prompt)
      canalCliente,
      cuponActivo,
      cuponFlags,
    }),
    [cliente, sesionId, loading, canalCliente, cuponActivo, cuponFlags]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
