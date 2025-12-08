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

import CartDrawer from "./components/cart/CartDrawer.jsx";

const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <CouponProvider>
          <CartProvider>
            {/* Drawer del carrito siempre montado, con acceso a los contexts */}
            <CartDrawer />

            <Routes>
              <Route path="/" element={<ShopHome />} />
              <Route path="/login" element={<LoginClientePage />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<FinalizarCompraPage />} />
              <Route path="/mis-cupones" element={<MisCuponesPage />} />
            </Routes>
          </CartProvider>
        </CouponProvider>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;
