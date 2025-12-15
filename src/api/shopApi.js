// // src/api/shopApi.js
// import axios from "axios";

// const API = import.meta.env.VITE_API_URL_BACKEND;

// // LOGIN CLIENTE
// export const loginClienteApi = (payload) =>
//   axios.post(`${API}/shop/login`, payload);

// // REGISTRAR SESIÓN
// export const registrarSesionApi = (cliente_id, origen = "web_shop") =>
//   axios.post(`${API}/shop/sesiones`, { cliente_id, origen });

// // REGISTRAR VISUALIZACIÓN
// export const registrarVisualizacionApi = ({
//   producto_id,
//   cliente_id = null,
//   sesion_cliente_id = null,
//   origen = "web_shop",
// }) =>
//   axios.post(`${API}/shop/visualizaciones`, {
//     producto_id,
//     cliente_id,
//     sesion_cliente_id,
//     origen,
//   });

// // VALIDAR CUPÓN
// export const validarCuponApi = ({ cliente_id, codigo, total_bruto }) =>
//   axios.post(`${API}/shop/cupones/validar`, {
//     cliente_id,
//     codigo,
//     total_bruto,
//   });

// // CREAR VENTA
// export const crearVentaApi = ({
//   cliente_id,
//   items,
//   monto_abonado = 0,
//   estado_nombre = "PENDIENTE_PAGO",
//   codigo_cupon = null,
// }) => {
//   const payload = {
//     cliente_id,
//     items,
//     monto_abonado,
//     estado_nombre,
//   };

//   if (codigo_cupon) {
//     payload.codigo_cupon = codigo_cupon;
//   }

//   return axios.post(`${API}/shop/ventas`, payload);
// };

// // MIS CUPONES
// export const obtenerCuponesClienteApi = (cliente_id) =>
//   axios.get(`${API}/shop/cupones`, {
//     params: { cliente_id },
//   });

// src/api/shopApi.js
// src/api/shopApi.js
import axios from "axios";

const API = import.meta.env.VITE_API_URL_BACKEND;

/**
 * ⚠️ Compatibilidad:
 * - Las funciones "Api" devuelven el AXIOS RESPONSE (como tu versión anterior).
 * - Además dejo helpers "*Data" que devuelven response.data (opcional).
 */

/* =========================
   LOGIN / Identificación
========================= */

// ✅ nombre anterior (NO rompe tu front viejo)
export const loginClienteApi = (payload) =>
  axios.post(`${API}/shop/login`, payload);

// ✅ alias nuevo (por si en algunos archivos ya lo usaste)
export const loginShopApi = (payload) =>
  axios.post(`${API}/shop/login`, payload);

// (opcional) helpers que devuelven data directamente
export const loginClienteData = async (payload) => (await loginClienteApi(payload)).data;
export const loginShopData = async (payload) => (await loginShopApi(payload)).data;

/* =========================
   SESIONES
========================= */

export const registrarSesionApi = (cliente_id, origen = "web_shop") =>
  axios.post(`${API}/shop/sesiones`, { cliente_id, origen });

export const registrarSesionData = async (cliente_id, origen = "web_shop") =>
  (await registrarSesionApi(cliente_id, origen)).data;

/* =========================
   VISUALIZACIONES
========================= */

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

export const registrarVisualizacionData = async (payload) =>
  (await registrarVisualizacionApi(payload)).data;

/* =========================
   CUPONES
========================= */

export const validarCuponApi = ({ cliente_id, codigo, total_bruto }) =>
  axios.post(`${API}/shop/cupones/validar`, {
    cliente_id,
    codigo,
    total_bruto,
  });

export const validarCuponData = async (payload) =>
  (await validarCuponApi(payload)).data;

export const obtenerCuponesClienteApi = (cliente_id) =>
  axios.get(`${API}/shop/cupones`, {
    params: { cliente_id },
  });

export const obtenerCuponesClienteData = async (cliente_id) =>
  (await obtenerCuponesClienteApi(cliente_id)).data;

/* =========================
   VENTAS
========================= */

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

  // no enviamos null
  if (codigo_cupon) payload.codigo_cupon = codigo_cupon;

  return axios.post(`${API}/shop/ventas`, payload);
};

export const crearVentaData = async (payload) =>
  (await crearVentaApi(payload)).data;


export const getVentaByIdApi = async (ventaId) => {
  const resp = await axios.get(`${API}/shop/ventas/${ventaId}`);
  return resp?.data ?? resp;
};
