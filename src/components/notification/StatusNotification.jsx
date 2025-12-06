// src/components/common/StatusNotification.jsx
const variants = {
  loading: {
    container:
      "border border-blue-500/40 bg-blue-500/5 text-blue-100",
  },
  success: {
    container:
      "border border-emerald-500/40 bg-emerald-500/5 text-emerald-100",
  },
  error: {
    container:
      "border border-red-500/40 bg-red-500/5 text-red-100",
  },
  info: {
    container:
      "border border-neutral-600 bg-neutral-900/80 text-neutral-100",
  },
};

const StatusNotification = ({
  variant = "info",
  message,
  showSpinner = false,
  className = "",
}) => {
  if (!message) return null;

  const styles = variants[variant] || variants.info;

  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm ${styles.container} ${className}`}
    >
      {showSpinner && (
        <span
          className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      )}
      <p>{message}</p>
    </div>
  );
};

export default StatusNotification;
