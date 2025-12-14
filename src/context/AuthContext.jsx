
// // import { createContext, useContext, useEffect, useMemo, useState } from "react";
// // import { loginShopApi } from "../api/shopApi";
// // import { useNotification } from "./NotificationContext";

// // const AuthContext = createContext(null);

// // const LS_KEY = "jg_shop_buyer"; // guarda comprador + estado shop

// // export const AuthProvider = ({ children }) => {
// //   const { showNotification } = useNotification();

// //   const [cliente, setCliente] = useState(null);
// //   const [sesionId, setSesionId] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   // ✅ Estado shop
// //   const [canalCliente, setCanalCliente] = useState(null);
// //   const [cuponActivo, setCuponActivo] = useState(null);
// //   const [cuponFlags, setCuponFlags] = useState({
// //     cupon_creado: false,
// //     cupon_bloqueado: false,
// //     cupon_next_available_at: null,
// //     cupon_block_reason: null,
// //   });

// //   // 🔁 hidratar desde localStorage
// //   useEffect(() => {
// //     const raw = localStorage.getItem(LS_KEY);
// //     if (!raw) return;

// //     try {
// //       const parsed = JSON.parse(raw);

// //       setCliente(parsed?.cliente ?? null);
// //       setCanalCliente(parsed?.canal_cliente ?? null);
// //       setCuponActivo(parsed?.cupon_activo ?? null);
// //       setCuponFlags({
// //         cupon_creado: !!parsed?.cupon_creado,
// //         cupon_bloqueado: !!parsed?.cupon_bloqueado,
// //         cupon_next_available_at: parsed?.cupon_next_available_at ?? null,
// //         cupon_block_reason: parsed?.cupon_block_reason ?? null,
// //       });
// //     } catch {
// //       localStorage.removeItem(LS_KEY);
// //     }
// //   }, []);

// //   // 💾 persistir comprador + estado shop
// //   useEffect(() => {
// //     const payload = {
// //       cliente,
// //       canal_cliente: canalCliente,
// //       cupon_activo: cuponActivo,
// //       ...cuponFlags,
// //     };

// //     if (cliente) localStorage.setItem(LS_KEY, JSON.stringify(payload));
// //     else localStorage.removeItem(LS_KEY);
// //   }, [cliente, canalCliente, cuponActivo, cuponFlags]);

// //   // ✅ LOGIN: identificación de comprador
// //   const login = async ({ nombre, apellido, dni, email }) => {
// //     setLoading(true);

// //     try {
// //       const resp = await loginShopApi({ nombre, apellido, dni, email });

// //       // 🔧 compatibilidad: si loginShopApi devuelve axios response => resp.data
// //       // si devuelve data directo => resp
// //       const data = resp?.data ?? resp;

// //       const clienteResp = data?.cliente ?? null;

// //       if (!clienteResp) {
// //         throw new Error("No se recibió 'cliente' desde /shop/login");
// //       }

// //       setCliente(clienteResp);
// //       setCanalCliente(data?.canal_cliente ?? null);
// //       setCuponActivo(data?.cupon_activo ?? null);
// //       setCuponFlags({
// //         cupon_creado: !!data?.cupon_creado,
// //         cupon_bloqueado: !!data?.cupon_bloqueado,
// //         cupon_next_available_at: data?.cupon_next_available_at ?? null,
// //         cupon_block_reason: data?.cupon_block_reason ?? null,
// //       });

// //       // ✅ UX: mensajes claros
// //       if (data?.cupon_activo?.codigo) {
// //         showNotification(
// //           "success",
// //           `🎁 Cupón disponible: ${data.cupon_activo.codigo} (${data.cupon_activo.descuento_porcentaje}% OFF)`
// //         );
// //       } else if (data?.cupon_bloqueado) {
// //         showNotification(
// //           "info",
// //           data?.cupon_block_reason ||
// //             "Ya utilizaste tu beneficio. Volvé a intentarlo más adelante."
// //         );
// //       } else {
// //         showNotification("success", "Identificación exitosa. ¡Ya podés comprar!");
// //       }

// //       return data;
// //     } catch (err) {
// //       const backendMsg =
// //         err?.response?.data?.error ||
// //         err?.response?.data?.message ||
// //         err?.message ||
// //         "No se pudo identificar al comprador.";

// //       showNotification("error", backendMsg);
// //       throw err;
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const logout = () => {
// //     setCliente(null);
// //     setSesionId(null);
// //     setCanalCliente(null);
// //     setCuponActivo(null);
// //     setCuponFlags({
// //       cupon_creado: false,
// //       cupon_bloqueado: false,
// //       cupon_next_available_at: null,
// //       cupon_block_reason: null,
// //     });
// //     localStorage.removeItem(LS_KEY);
// //   };

// //   const value = useMemo(
// //     () => ({
// //       cliente,
// //       sesionId,
// //       loading,
// //       login,
// //       logout,

// //       canalCliente,
// //       cuponActivo,
// //       cuponFlags,
// //     }),
// //     [cliente, sesionId, loading, canalCliente, cuponActivo, cuponFlags]
// //   );

// //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // };

// // export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useEffect, useMemo, useState } from "react";
// import { loginShopApi } from "../api/shopApi";
// import { useNotification } from "./NotificationContext";

// const AuthContext = createContext(null);

// const LS_KEY = "jg_shop_buyer"; // guarda comprador + estado shop

// export const AuthProvider = ({ children }) => {
//   const { showNotification } = useNotification();

//   const [cliente, setCliente] = useState(null);
//   const [sesionId, setSesionId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // ✅ Estado shop
//   const [canalCliente, setCanalCliente] = useState(null);
//   const [cuponActivo, setCuponActivo] = useState(null);
//   const [cuponFlags, setCuponFlags] = useState({
//     cupon_creado: false,
//     cupon_bloqueado: false,
//     cupon_next_available_at: null,
//     cupon_block_reason: null,
//   });

//   // 🔁 hidratar desde localStorage
//   useEffect(() => {
//     const raw = localStorage.getItem(LS_KEY);
//     if (!raw) return;

//     try {
//       const parsed = JSON.parse(raw);

//       setCliente(parsed?.cliente ?? null);
//       setCanalCliente(parsed?.canal_cliente ?? null);
//       setCuponActivo(parsed?.cupon_activo ?? null);
//       setCuponFlags({
//         cupon_creado: !!parsed?.cupon_creado,
//         cupon_bloqueado: !!parsed?.cupon_bloqueado,
//         cupon_next_available_at: parsed?.cupon_next_available_at ?? null,
//         cupon_block_reason: parsed?.cupon_block_reason ?? null,
//       });
//     } catch {
//       localStorage.removeItem(LS_KEY);
//     }
//   }, []);

//   // 💾 persistir comprador + estado shop
//   useEffect(() => {
//     const payload = {
//       cliente,
//       canal_cliente: canalCliente,
//       cupon_activo: cuponActivo,
//       ...cuponFlags,
//     };

//     if (cliente) localStorage.setItem(LS_KEY, JSON.stringify(payload));
//     else localStorage.removeItem(LS_KEY);
//   }, [cliente, canalCliente, cuponActivo, cuponFlags]);

//   // ✅ LOGIN: identificación de comprador
//   const login = async ({ nombre, apellido, dni, email }) => {
//     setLoading(true);

//     try {
//       const resp = await loginShopApi({ nombre, apellido, dni, email });

//       // 🔧 compatibilidad: si loginShopApi devuelve axios response => resp.data
//       // si devuelve data directo => resp
//       const data = resp?.data ?? resp;

//       const clienteResp = data?.cliente ?? null;

//       if (!clienteResp) {
//         throw new Error("No se recibió 'cliente' desde /shop/login");
//       }

//       setCliente(clienteResp);
//       setCanalCliente(data?.canal_cliente ?? null);
//       setCuponActivo(data?.cupon_activo ?? null);
//       setCuponFlags({
//         cupon_creado: !!data?.cupon_creado,
//         cupon_bloqueado: !!data?.cupon_bloqueado,
//         cupon_next_available_at: data?.cupon_next_available_at ?? null,
//         cupon_block_reason: data?.cupon_block_reason ?? null,
//       });

//       // ✅ UX: mensajes claros
//       if (data?.cupon_activo?.codigo) {
//         showNotification(
//           "success",
//           `🎁 Cupón disponible: ${data.cupon_activo.codigo} (${data.cupon_activo.descuento_porcentaje}% OFF)`
//         );
//       } else if (data?.cupon_bloqueado) {
//         showNotification(
//           "info",
//           data?.cupon_block_reason ||
//             "Ya utilizaste tu beneficio. Volvé a intentarlo más adelante."
//         );
//       } else {
//         showNotification("success", "Identificación exitosa. ¡Ya podés comprar!");
//       }

//       return data;
//     } catch (err) {
//       const backendMsg =
//         err?.response?.data?.error ||
//         err?.response?.data?.message ||
//         err?.message ||
//         "No se pudo identificar al comprador.";

//       showNotification("error", backendMsg);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ NUEVO: invalidar cupón activo cacheado (ej: después de comprar)
//   const invalidateCuponActivo = (options = {}) => {
//     const { markBlocked = true, reason = "Cupón ya utilizado." } = options;

//     setCuponActivo(null);

//     // opcional: marcar bloqueado para que el checkout muestre mensaje informativo
//     if (markBlocked) {
//       setCuponFlags((prev) => ({
//         ...prev,
//         cupon_creado: false,
//         cupon_bloqueado: true,
//         cupon_block_reason: reason,
//       }));
//     } else {
//       setCuponFlags((prev) => ({
//         ...prev,
//         cupon_creado: false,
//       }));
//     }
//   };

//   const logout = () => {
//     setCliente(null);
//     setSesionId(null);
//     setCanalCliente(null);
//     setCuponActivo(null);
//     setCuponFlags({
//       cupon_creado: false,
//       cupon_bloqueado: false,
//       cupon_next_available_at: null,
//       cupon_block_reason: null,
//     });
//     localStorage.removeItem(LS_KEY);
//   };

//   const value = useMemo(
//     () => ({
//       cliente,
//       sesionId,
//       loading,
//       login,
//       logout,

//       canalCliente,
//       cuponActivo,
//       cuponFlags,

//       // ✅ NUEVO
//       invalidateCuponActivo,
//     }),
//     [
//       cliente,
//       sesionId,
//       loading,
//       canalCliente,
//       cuponActivo,
//       cuponFlags,
//     ]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);

// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginShopApi } from "../api/shopApi";
import { useNotification } from "./NotificationContext";

const AuthContext = createContext(null);
const LS_KEY = "jg_shop_buyer"; // comprador + estado shop

export const AuthProvider = ({ children }) => {
  const { showNotification } = useNotification();

  const [cliente, setCliente] = useState(null);
  const [sesionId, setSesionId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estado "shop" que viene del backend (/shop/login)
  const [canalCliente, setCanalCliente] = useState(null);
  const [cuponActivo, setCuponActivo] = useState(null);
  const [cuponFlags, setCuponFlags] = useState({
    cupon_creado: false,
    cupon_bloqueado: false,
    cupon_next_available_at: null,
    cupon_block_reason: null,
  });

  // 🔁 Hidratar desde localStorage
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

  // 💾 Persistir comprador + estado shop (ojo: cuponActivo es solo "sugerencia", NO aplicado)
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

  // ✅ LOGIN comprador
  const login = async ({ nombre, apellido, dni, email }) => {
    setLoading(true);
    try {
      const resp = await loginShopApi({ nombre, apellido, dni, email });
      const data = resp?.data ?? resp;

      const clienteResp = data?.cliente ?? null;
      if (!clienteResp) throw new Error("No se recibió 'cliente' desde /shop/login");

      setCliente(clienteResp);
      setCanalCliente(data?.canal_cliente ?? null);
      setCuponActivo(data?.cupon_activo ?? null);
      setCuponFlags({
        cupon_creado: !!data?.cupon_creado,
        cupon_bloqueado: !!data?.cupon_bloqueado,
        cupon_next_available_at: data?.cupon_next_available_at ?? null,
        cupon_block_reason: data?.cupon_block_reason ?? null,
      });

      // UX mensajes
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
      const backendMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo identificar al comprador.";

      showNotification("error", backendMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ invalida el cupón sugerido (cuponActivo) cacheado en AuthContext/localStorage
   * Útil cuando:
   * - el usuario realizó una compra intentando usar cupón
   * - el backend confirma que fue aplicado o que no aplica
   */
  const invalidateCuponActivo = (options = {}) => {
    const { markBlocked = true, reason = "Cupón no disponible." } = options;

    // eliminar sugerencia
    setCuponActivo(null);

    // opcional: marcar bloqueado para mostrar mensaje en checkout
    setCuponFlags((prev) => ({
      ...prev,
      cupon_creado: false,
      cupon_bloqueado: markBlocked ? true : prev.cupon_bloqueado,
      cupon_block_reason: markBlocked ? reason : prev.cupon_block_reason,
    }));
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
    localStorage.removeItem(LS_KEY);
  };

  const value = useMemo(
    () => ({
      cliente,
      sesionId,
      loading,
      login,
      logout,

      canalCliente,
      cuponActivo,
      cuponFlags,

      invalidateCuponActivo,
    }),
    [cliente, sesionId, loading, canalCliente, cuponActivo, cuponFlags]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider />");
  return ctx;
};
