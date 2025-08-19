import React, { useEffect, useState } from "react";
import api from "../api/api";
import type { Product } from "../types/productTypes";

interface Props {
  productId: number | null;
  onProductUpdated: () => void;
  onClose: () => void;
}

const ProductDetails: React.FC<Props> = ({ productId, onProductUpdated, onClose }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }
    
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<Product>(`/${productId}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
         setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]); // Fixed variable name from ProductId to productId

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!product) return;
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
  if (!product) return;

  try {
    setLoading(true);
    const res = await api.put(`/${productId}`, {
      title: product.title,
      price: product.price,
      description: product.description,
     
    });
    
    console.log("Updated product:", res.data);
    onProductUpdated();
    setIsEditing(false);
  } catch (err) {
    console.error(err);
    // setError("Failed to update product");
  } finally {
    setLoading(false);
  }
};
;

  const handleCancelEdit = () => {
    
    if (productId) {
      api.get<Product>(`/${productId}`)
        .then(res => setProduct(res.data))
        .catch(err => console.error(err));
    }
    setIsEditing(false);
  };

  if (loading) return <div className="p-4 text-center">Loading product details...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!product) return <div className="p-4">No product selected</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Product Details</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          ) : (
            <p className="mt-1">{product.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          {isEditing ? (
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          ) : (
            <p className="mt-1">{product.category}</p>
          )}
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          {isEditing ? (
            <input
              type="text"
              name="category"
              value={product.description}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          ) : (
            <p className="mt-1">{product.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          {isEditing ? (
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              
            />
          ) : (
            <p className="mt-1">${product.price.toFixed(2)}</p>
          )}
        </div>

        {product.images && product.images.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <div className="mt-2 flex space-x-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="h-20 w-20 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex  justify-end space-x-2">
        {!isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-primaryColor-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primaryColor-500 text-white rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;