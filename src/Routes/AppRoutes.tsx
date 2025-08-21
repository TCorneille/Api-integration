import ProductPage from "../pages/ProductPage";
import Login from "../pages/Login";
import { Routes, Route } from "react-router-dom";
import CategoryPage from "../pages/CategoryPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/category" element={<CategoryPage />} />
    
      {/* Add more routes as needed */}
    </Routes>
  );
}