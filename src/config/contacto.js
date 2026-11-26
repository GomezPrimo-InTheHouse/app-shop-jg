// src/config/contacto.js
// Datos de contacto del local. Cambiá el número ACÁ y se actualiza en todo el shop.

// Formato internacional sin "+", espacios ni guiones: 54 9 + característica + número
export const WHATSAPP_NUMERO = "5493534012117";

// Link de WhatsApp con mensaje opcional precargado
export const whatsappUrl = (mensaje = "") =>
  `https://wa.me/${WHATSAPP_NUMERO}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ""}`;
