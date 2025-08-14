// src/components/ProductList.tsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";
import type { Product } from "../../types/productTypes";

interface Props {
  onSelectProduct: (id: number | null) => void;
  refreshKey: number;
}

const ProductList: React.FC<Props> = ({ onSelectProduct, refreshKey }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/"); //
        const fetchedProducts = res.data.products.map((p: any) => ({
          id: p.id,
          title: p.title, // Map API title to our UI name field
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

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/${id}`); // Correct DELETE endpoint
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  if (loading) return <p className="text-center p-4">Loading products...</p>;
  if (error) return <p className="text-center text-red-500 p-4">{error}</p>;

  return (
    <div className="bg-primaryColor-100 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">Products</h2>
      <ul className="space-y-3 grid grid-cols-4 max-sm:flex max-sm:flex-col  ">
        {products.map((product) => (
          <li
            key={product.id}
            className="min-sm:w-[350px] max-sm:w-full p-6 rounded-lg shadow-sm flex bg-primaryColor-50 flex-col justify-between items-center gap-4"
          >
            <div className=" w-full">
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
                onClick={() => onSelectProduct(product.id)}
                className="px-3 w-30 py-1 bg-primaryColor-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="px-3 py-1 w-30 bg-red-900 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
