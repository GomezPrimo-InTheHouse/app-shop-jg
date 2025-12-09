// src/context/NotificationContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import StatusNotification from "../components/notification/StatusNotification.jsx";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback(
    (variant, message, options = {}) => {
      const id = Date.now();
      setNotification({
        id,
        variant,       // "success" | "error" | "info" | "warning" | "loading" ...
        message,
        duration: options.duration ?? 3000,   // 3s por defecto
      });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}

      {notification && (
        <StatusNotification
          key={notification.id}
          // props mínimos que ya usás
          variant={notification.variant}
          message={notification.message}
          // nuevos props para autocierre
          duration={notification.duration}
          onClose={hideNotification}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
