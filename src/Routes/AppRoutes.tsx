import ProductPage from "../pages/ProductPage";
import Login from "../pages/Login";
import { Routes, Route } from "react-router-dom";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/products" element={<ProductPage />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}