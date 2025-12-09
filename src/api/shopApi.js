// src/api/shopApi.js
import axios from "axios";

const API = import.meta.env.VITE_API_URL_BACKEND;

// LOGIN CLIENTE
export const loginClienteApi = (payload) =>
  axios.post(`${API}/shop/login`, payload);

// REGISTRAR SESIÓN
export const registrarSesionApi = (cliente_id, origen = "web_shop") =>
  axios.post(`${API}/shop/sesiones`, { cliente_id, origen });

// REGISTRAR VISUALIZACIÓN
export const registrarVisualizacionApi = ({
  producto_id,
  cliente_id = null,
  sesion_cliente_id = null,
  origen = "web_shop",
}) =>
  axios.post(`${API}/shop/visualizaciones`, {
    producto_id,
    cliente_id,
    sesion_cliente_id,
    origen,
  });

// VALIDAR CUPÓN
export const validarCuponApi = ({ cliente_id, codigo, total_bruto }) =>
  axios.post(`${API}/shop/cupones/validar`, {
    cliente_id,
    codigo,
    total_bruto,
  });

// CREAR VENTA
export const crearVentaApi = ({
  cliente_id,
  items,
  monto_abonado = 0,
  estado_nombre = "PENDIENTE_PAGO",
  codigo_cupon = null,
}) => {
  const payload = {
    cliente_id,
    items,
    monto_abonado,
    estado_nombre,
  };

  if (codigo_cupon) {
    payload.codigo_cupon = codigo_cupon;
  }

  return axios.post(`${API}/shop/ventas`, payload);
};

// MIS CUPONES
export const obtenerCuponesClienteApi = (cliente_id) =>
  axios.get(`${API}/shop/cupones`, {
    params: { cliente_id },
  });
