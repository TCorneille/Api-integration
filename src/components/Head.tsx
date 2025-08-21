import React from "react";
import { FiSearch } from "react-icons/fi";
import { TiShoppingCart } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

interface HeaderControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCartClick: () => void;
  onAddProductClick: () => void;
}

const HeaderControls: React.FC<HeaderControlsProps> = ({
  searchTerm,
  onSearchChange,
  onCartClick,
  onAddProductClick,
}) => {
  const { cart } = useCart();

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-30 flex items-center justify-between">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md mr-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border border-gray-400 p-2 pl-10 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search products..."
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Buttons Container */}
      <div className="flex items-center space-x-4">
        {/* Add Product Button */}
        <button
          onClick={onAddProductClick}
          className="bg-primaryColor-500 text-white font-bold py-2 px-4 rounded hover:bg-primaryColor-800 flex items-center"
        >
          <span className="text-xl mr-1">+</span> Add Product
        </button>

        {/* Cart Button */}
        <button
          onClick={onCartClick}
          className="bg-primaryColor-500 text-white p-3 rounded-full shadow-lg hover:bg-primaryColor-600 relative"
        >
          <TiShoppingCart className="w-6 h-6" />
          {cart && cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {cart.length}
            </span>
          )}
        </button>

        {/* Logout Button */}
        <Link
          to="/"
          className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded transition-colors"
        >
          Log out
        </Link>
      </div>
    </div>
  );
};

export default HeaderControls;