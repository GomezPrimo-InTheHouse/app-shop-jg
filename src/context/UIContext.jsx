import { createContext, useContext, useState } from "react";

const UiContext = createContext(null);

export const UiProvider = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <UiContext.Provider
      value={{
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};

export const useUI = () => useContext(UiContext);
