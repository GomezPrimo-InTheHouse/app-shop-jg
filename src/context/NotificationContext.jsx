// src/context/NotificationContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import StatusNotification from "../components/notification/StatusNotification";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [key, setKey] = useState(0); // para forzar animación

  const showNotification = useCallback((type, message) => {
    setKey((k) => k + 1);
    setNotification({ type, message });
  }, []);

  const hideNotification = () => setNotification(null);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {notification && (
        <div className="fixed bottom-4 right-4 z-50">
          <StatusNotification
            key={key}
            type={notification.type}
            message={notification.message}
            onClose={hideNotification}
          />
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
