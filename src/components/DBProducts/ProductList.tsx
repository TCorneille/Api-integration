import React, { useEffect, useState } from "react";
import api from "../../api/api";
import type { Product } from "../../types/productTypes";
import { FiSearch } from "react-icons/fi";
import ProductDetails from "../ProductDetails";
import { TiShoppingCart } from "react-icons/ti";
import { useCart } from "../../context/CartContext";
import Cart from "../Cart";

interface Props {
  product: Product;
  onSelectProduct: (id: number | null) => void;
  refreshKey: number;
  onProductUpdated: () => void;
}

const ProductList: React.FC<Props> = ({ onSelectProduct, refreshKey, onProductUpdated }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [showCart, setShowCart] = useState(false);
  const { cart, addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/");
        const fetchedProducts = res.data.products.map((p: any) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          price: p.price,
          discountPercentage:p.discountPercentage,
          images: p.images
        }));
        setProducts(fetchedProducts);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [refreshKey]);

  const handleEditClick = (productId: number) => {
    setSelectedProductId(productId);
    onSelectProduct(productId);
  };

  const handleCloseDetails = () => {
    setSelectedProductId(null);
    onSelectProduct(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      onProductUpdated();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      setCartError(null);
      setAddingToCart(productId);
      
      // Your CartContext expects just the product ID and fetches details itself
      await addToCart(productId);
      
      console.log("Product added to cart:", productId);
      
    } catch (err) {
      console.error("Failed to add to cart:", err);
      setCartError("Failed to add product to cart. Please try again.");
      setTimeout(() => setCartError(null), 3000);
    } finally {
      setAddingToCart(null);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center p-4">Loading products...</p>;
  if (error) return <p className="text-center text-red-500 p-4">{error}</p>;

  return (
    <div className="min-lg:ml-8 mt-25 min-md:ml-5">
      {/* Cart Button */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setShowCart(true)}
          className="bg-primaryColor-500 text-white p-3 rounded-full shadow-lg hover:bg-primaryColor-600 relative"
        >
          <TiShoppingCart className="w-6 h-6" />
          {cart && cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Error message for cart issues */}
      {cartError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-3 rounded-md shadow-md z-50">
          {cartError}
        </div>
      )}
      
      <div className="relative mb-4 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-400 p-2 pl-10 rounded w-1/2 max-sm:w-10/12 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder=" "
        />
        
        {searchTerm === "" && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 flex items-center pointer-events-none">
            <FiSearch className="mr-2" />
            <span>Search product...</span>
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold flex justify-center mb-3">Products</h2>
      
      {filteredProducts.length === 0 ? (
        <p className="text-center p-4">No products found</p>
      ) : (
        <ul className="space-y-3 grid min-lg:grid-cols-4 min-md:grid-cols-3 max-sm:flex max-sm:flex-col max-sm:items-center">
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              className="min-lg:w-[350px] min-md:w-[250px] max-sm:w-10/12 p-6 rounded-lg shadow-sm flex bg-primaryColor-50 flex-col justify-between items-center gap-4"
            >
              <div className="w-full">
                <div className="flex  justify-between">
                <h2 className="font-bold">{product.title}</h2>
                 <p className="bg-accent-300">-{product.discountPercentage}%</p>
                 </div>
                <div className="flex justify-between p-2 w-full items-end">
                  <p>{product.category}</p>
                 
                  <p className="text-3xl">${product.price}</p>

                </div>
              </div>
              
              <div className="flex gap-2">
                {product.images && product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-24 h-24 bg-white object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/96";
                    }}
                  />
                )}
              </div>
              
              <div className="space-x-2 flex justify-between w-full">
                <button
                  onClick={() => handleEditClick(product.id)}
                  className="bg-primaryColor-500 text-white rounded px-3 py-2 min-md:w-20"
                >
                  Details
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-3 py-2 bg-red-900 text-white rounded min-md:w-20"
                >
                  Delete
                </button>
              </div>
              
              <button
                onClick={() => handleAddToCart(product.id)} 
                disabled={addingToCart === product.id}
                className="bg-primaryColor-800 text-white flex justify-center items-center gap-2 w-full rounded px-3 py-2 hover:bg-primaryColor-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {addingToCart === product.id ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <TiShoppingCart className="size-6" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedProductId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-primaryColor-50 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ProductDetails
              productId={selectedProductId}
              onUpdated={() => {
                onProductUpdated();
                handleCloseDetails();
              }}
              onClose={handleCloseDetails}
            />
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 bg-opacity-30" onClick={() => setShowCart(false)}></div>
          <div className="absolute right-0 top-0 h-full w-96 max-w-full bg-white shadow-xl">
            <Cart />
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;