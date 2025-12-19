// src/App.jsx
import { Routes, Route } from "react-router-dom";

import ShopHome from "./pages/ShopHome.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import FinalizarCompraPage from "./pages/FinalizarCompraPage.jsx";
import LoginClientePage from "./pages/LoginClientePage.jsx";
import MisCuponesPage from "./pages/MisCuponesPage.jsx";

import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CouponProvider } from "./context/CouponContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import ConfirmacionCompraPage from "./pages/ConfirmacionCompraPage.jsx"; // 👈 NUEVO
import { UIProvider } from "./context/UIContext.jsx";
import { FavoriteProvider } from "./context/FavoriteContext";
import MisFavoritosPage from "./pages/MisFavoritosPage.jsx";
import CartDrawer from "./components/cart/CartDrawer.jsx";

const App = () => {
  return (
    <UIProvider>
      <NotificationProvider>
        <AuthProvider>
          <CouponProvider>
            <FavoriteProvider>
            <CartProvider>
              {/* Drawer del carrito siempre montado, con acceso a los contexts */}
              
              <CartDrawer />

              <Routes>
                <Route path="/" element={<ShopHome />} />
                <Route path="/login" element={<LoginClientePage />} />
                <Route path="/producto/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<FinalizarCompraPage />} />
                <Route path="/favoritos" element={<MisFavoritosPage />} />
                <Route path="/mis-cupones" element={<MisCuponesPage />} />
                <Route
                  path="/shop/confirmacion"
                  element={<ConfirmacionCompraPage />}
                />
              </Routes>
            </CartProvider>
            </FavoriteProvider>
          </CouponProvider>
        </AuthProvider>
      </NotificationProvider>
    </UIProvider>
  );
};

export default App;
