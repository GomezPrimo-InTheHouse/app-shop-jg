import React from "react";
// Importar iconos para cada tipo de variante (asegúrate de tener 'lucide-react' instalado)
import { AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react"; 

// 1. Definición de Variantes Mejorada (Incluye Iconos y Estilos Dark Mode)
const variants = {
  loading: {
    // Texto y Spinner usan el color azul para indicar actividad
    text: "text-blue-600 dark:text-blue-400",
    container:
      "border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/40",
    Icon: Loader2, // Usaremos este icono para indicar carga
  },
  success: {
    // Éxito usa verde (esmeralda)
    text: "text-emerald-600 dark:text-emerald-400",
    container:
      "border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/40",
    Icon: CheckCircle,
  },
  error: {
    // Error usa rojo
    text: "text-red-600 dark:text-red-400",
    container:
      "border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/40",
    Icon: AlertTriangle,
  },
  info: {
    // Información usa un color neutro o de acento ligero (índigo o gris)
    text: "text-gray-600 dark:text-gray-400",
    container:
      "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40",
    Icon: Info,
  },
};

const StatusNotification = ({
  variant = "info",
  message,
  // showSpinner ya no es necesario si usamos variant="loading"
  className = "",
}) => {
  if (!message) return null;

  const style = variants[variant] || variants.info;
  const { Icon, text, container } = style;
  
  // 2. Lógica para el spinner: solo si el estado es 'loading'
  const isPending = variant === "loading";

  return (
    <div
      // Uso de estilos modernizados y completos
      className={`flex items-center gap-3 rounded-xl p-4 shadow-sm text-sm 
                  ${container} ${className}`}
      role="status" // Accesibilidad: indica el propósito del div
      aria-live="polite" // Accesibilidad: notifica a los lectores de pantalla sobre cambios
    >
      {/* 3. Renderizado Condicional del Icono/Spinner */}
      {isPending ? (
        // Spinner para el estado 'loading'
        <Loader2 
          className={`h-5 w-5 animate-spin ${text}`} 
          aria-hidden="true" 
        />
      ) : (
        // Icono para otros estados (success, error, info)
        <Icon className={`h-5 w-5 ${text}`} aria-hidden="true" />
      )}
      
      {/* 4. Mensaje */}
      <p className={`font-medium ${text}`}>{message}</p>
    </div>
  );
};

export default StatusNotification;