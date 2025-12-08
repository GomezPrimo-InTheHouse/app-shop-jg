// src/context/CouponContext.jsx
import { createContext, useContext, useState } from "react";

const CouponContext = createContext(null);

/**
 * cupon: objeto completo devuelto por /cupones/validar
 * descuentoMonto: número
 * totalConDescuento: número
 */

export const CouponProvider = ({ children }) => {
  const [cupon, setCupon] = useState(null);
  const [descuentoMonto, setDescuentoMonto] = useState(0);
  const [totalConDescuento, setTotalConDescuento] = useState(null);

  const aplicarCupon = ({ cupon, descuento_monto, total_con_descuento }) => {
    setCupon(cupon);
    setDescuentoMonto(descuento_monto || 0);
    setTotalConDescuento(total_con_descuento ?? null);
  };

  const limpiarCupon = () => {
    setCupon(null);
    setDescuentoMonto(0);
    setTotalConDescuento(null);
  };

  return (
    <CouponContext.Provider
      value={{
        cupon,
        descuentoMonto,
        totalConDescuento,
        aplicarCupon,
        limpiarCupon,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupon = () => useContext(CouponContext);
