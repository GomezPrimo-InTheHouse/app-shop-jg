import React, { useEffect } from "react";
import { AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react";

// Variantes tal como las tenías
const variants = {
  loading: {
    text: "text-blue-600 dark:text-blue-400",
    container:
      "border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/40",
    Icon: Loader2,
  },
  success: {
    text: "text-emerald-600 dark:text-emerald-400",
    container:
      "border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/40",
    Icon: CheckCircle,
  },
  error: {
    text: "text-red-600 dark:text-red-400",
    container:
      "border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/40",
    Icon: AlertTriangle,
  },
  info: {
    text: "text-gray-600 dark:text-gray-400",
    container:
      "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40",
    Icon: Info,
  },
};

const StatusNotification = ({
  variant = "info",
  message,
  duration = 3000,      // ⬅ predeterminado 3s
  onClose,              // ⬅ callback para autocierre
  className = "",
}) => {
  if (!message) return null;

  const style = variants[variant] || variants.info;
  const { Icon, text, container } = style;
  const isPending = variant === "loading";

  // ⏳ AUTOCIERRE (solo si viene onClose)
  useEffect(() => {
    if (!onClose) return;
    if (variant === "loading") return; // loading NO se autocierra
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose, variant]);

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl 
                  p-4 shadow-lg backdrop-blur-md text-sm transition-all
                  ${container} ${className}`}
      role="status"
      aria-live="polite"
    >
      {isPending ? (
        <Loader2 className={`h-5 w-5 animate-spin ${text}`} aria-hidden="true" />
      ) : (
        <Icon className={`h-5 w-5 ${text}`} aria-hidden="true" />
      )}

      <p className={`font-medium ${text}`}>{message}</p>
    </div>
  );
};

export default StatusNotification;
