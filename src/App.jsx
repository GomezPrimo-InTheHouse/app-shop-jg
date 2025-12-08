// src/App.jsx
import { Routes, Route } from "react-router-dom";
import ShopHome from "./pages/ShopHome.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import  CartProvider  from "./context/CartContext.jsx";
import CartDrawer from "./components/cart/CartDrawer.jsx";

const App = () => {
  return (
    <CartProvider>
      {/* Drawer siempre montado, escucha el contexto */}
      <CartDrawer />

      {/* Las rutas ya están dentro de <BrowserRouter> gracias a main.jsx */}
      <Routes>
        <Route path="/" element={<ShopHome />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
      </Routes>
    </CartProvider>
  );
};

export default App;
