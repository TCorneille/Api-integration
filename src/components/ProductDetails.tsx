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
  const [backupProduct, setBackupProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false); // fetching
  const [saving, setSaving] = useState(false);   // saving
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch product when productId changes
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
  }, [productId]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!product) return;
    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]: name === "price" ? Number(value) : value
    });
  };

  // Save product updates with validation
  const handleSave = async () => {
    if (!product) return;

    if (!product.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (product.price <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    try {
      setSaving(true);
      const res = await api.put(`/${productId}`, {
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
      });

      console.log("Updated product:", res.data);
      onProductUpdated();
      setIsEditing(false);
      setError(null); // clear validation error on success
    } catch (err) {
      console.error(err);
      setError("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  // Start editing (store backup)
  const startEditing = () => {
    if (product) setBackupProduct({ ...product });
    setIsEditing(true);
  };

  // Cancel edit (restore backup)
  const handleCancelEdit = () => {
    if (backupProduct) setProduct(backupProduct);
    setIsEditing(false);
    setError(null);
  };

  // UI states
  if (loading) return <div className="p-4 text-center">Loading product details...</div>;
  if (error && !isEditing) return <div className="p-4 text-red-500">{error}</div>;
  if (!product) return <div className="p-4">No product selected</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Product Details</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>

      {/* Error message while editing */}
      {error && isEditing && (
        <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      {/* Product Info */}
      <div className="space-y-4">
        {/* Title */}
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

        {/* Category */}
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

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          {isEditing ? (
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              rows={3}
            />
          ) : (
            <p className="mt-1">{product.description}</p>
          )}
        </div>

        {/* Price */}
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

        {/* Images */}
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

        {/* Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Reviews</label>
            <ul className="mt-2 space-y-2">
              {product.reviews.map((review, index) => (
                <li key={index} className="p-3 border rounded bg-gray-50 text-sm">
                  <p className="font-semibold">{review.reviewerName ?? "Anonymous"}</p>
                  <p className="text-gray-600 italic">Rating: {review.rating ?? "N/A"} ★</p>
                  <p className="mt-1">{review.comment ?? "No comment provided."}</p>
                  {review.date && (
                    <p className="text-xs text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex justify-end space-x-2">
        {!isEditing ? (
          <>
            <button
              onClick={startEditing}
              className="px-4 py-2 bg-primaryColor-500 text-white rounded hover:bg-primaryColor-600"
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
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
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

