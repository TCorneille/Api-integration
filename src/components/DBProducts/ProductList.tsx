import React, { useEffect, useState } from "react";
import api from "../../api/api";
import type { Product } from "../../types/productTypes";
import { FiSearch } from "react-icons/fi";
import ProductDetails from "../ProductDetails";

interface Props {
  onSelectProduct: (id: number | null) => void;
  refreshKey: number;
  onProductUpdated: () => void; // Added this missing prop
}

const ProductList: React.FC<Props> = ({ onSelectProduct, refreshKey, onProductUpdated }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

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
    onSelectProduct(productId); // Notify parent about selected product
  };

  const handleCloseDetails = () => {
    setSelectedProductId(null);
    onSelectProduct(null); // Notify parent about deselected product
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center p-4">Loading products...</p>;
  if (error) return <p className="text-center text-red-500 p-4">{error}</p>;

  return (
    <div className="bg-primaryColor-100 p-4 rounded shadow">
      <div className="relative mb-4 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-400 p-2 pl-10 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder=" "
        />
        
        {searchTerm === "" && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 flex items-center pointer-events-none">
            <FiSearch className="mr-2" />
            <span>Search product...</span>
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-3">Products</h2>
      <ul className="space-y-3 grid grid-cols-4 max-sm:flex max-sm:flex-col">
        {filteredProducts.map((product) => (
          <li
            key={product.id}
            className="min-sm:w-[350px] min-md:w-[300px] max-sm:w-full p-6 rounded-lg shadow-sm flex bg-primaryColor-50 flex-col justify-between items-center gap-4"
          >
            <div className="w-full">
              <h2 className="font-bold">{product.title}</h2>
              <div className="flex justify-between bg-accent-00 w-full items-end">
                <p>{product.category}</p>
                <p className="text-3xl">${product.price}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {product.images && product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={`Product ${product.title} first image`}
                  className="w-24 h-24 bg-white object-cover rounded"
                />
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEditClick(product.id)}
                className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="px-3 py-2 bg-red-900 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedProductId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
    </div>
  );
};

export default ProductList;