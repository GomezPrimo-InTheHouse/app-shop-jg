// // src/context/CouponContext.jsx
// import { createContext, useContext, useState } from "react";

// const CouponContext = createContext(null);

// /**
//  * cupon: objeto completo devuelto por /cupones/validar
//  * descuentoMonto: número
//  * totalConDescuento: número
//  */

// export const CouponProvider = ({ children }) => {
//   const [cupon, setCupon] = useState(null);
//   const [descuentoMonto, setDescuentoMonto] = useState(0);
//   const [totalConDescuento, setTotalConDescuento] = useState(null);

//   const aplicarCupon = ({ cupon, descuento_monto, total_con_descuento }) => {
//     setCupon(cupon);
//     setDescuentoMonto(descuento_monto || 0);
//     setTotalConDescuento(total_con_descuento ?? null);
//   };

//   const limpiarCupon = () => {
//     setCupon(null);
//     setDescuentoMonto(0);
//     setTotalConDescuento(null);
//   };

//   return (
//     <CouponContext.Provider
//       value={{
//         cupon,
//         descuentoMonto,
//         totalConDescuento,
//         aplicarCupon,
//         limpiarCupon,
//       }}
//     >
//       {children}
//     </CouponContext.Provider>
//   );
// };

// export const useCoupon = () => useContext(CouponContext);
// src/context/CouponContext.jsx
import { createContext, useContext, useMemo, useCallback, useState } from "react";

const CouponContext = createContext(null);

/**
 * CouponContext = cupón aplicado SOLO en checkout.
 * - cupon: objeto (del backend /cupones/validar)
 * - descuentoMonto: number
 * - totalConDescuento: number|null
 */

export const CouponProvider = ({ children }) => {
  const [cupon, setCupon] = useState(null);
  const [descuentoMonto, setDescuentoMonto] = useState(0);
  const [totalConDescuento, setTotalConDescuento] = useState(null);

  // ✅ helper: garantiza números válidos
  const toNumber = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const aplicarCupon = useCallback(({ cupon, descuento_monto, total_con_descuento }) => {
    setCupon(cupon ?? null);
    setDescuentoMonto(toNumber(descuento_monto, 0));
    setTotalConDescuento(
      total_con_descuento === null || total_con_descuento === undefined
        ? null
        : toNumber(total_con_descuento, null)
    );
  }, []);

  const limpiarCupon = useCallback(() => {
    setCupon(null);
    setDescuentoMonto(0);
    setTotalConDescuento(null);
  }, []);

  const value = useMemo(
    () => ({
      cupon,
      descuentoMonto,
      totalConDescuento,
      aplicarCupon,
      limpiarCupon,
      // ✅ útil para UI (evita "descuento fantasma" si por error quedara monto sin cupon)
      hasCuponAplicado: !!cupon?.codigo,
    }),
    [cupon, descuentoMonto, totalConDescuento, aplicarCupon, limpiarCupon]
  );

  return <CouponContext.Provider value={value}>{children}</CouponContext.Provider>;
};

export const useCoupon = () => {
  const ctx = useContext(CouponContext);
  if (!ctx) throw new Error("useCoupon debe usarse dentro de <CouponProvider />");
  return ctx;
};
