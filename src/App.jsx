import { Routes, Route } from "react-router-dom";
import ShopHome from "./pages/ShopHome.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ShopHome />} />
      <Route path="/producto/:id" element={<ProductDetail />} />
    </Routes>
  );
};

export default App;
