import { useState } from "react";
import type { Product } from "./types/productTypes";

interface Props {
  onProductAdded: (product: Product) => void;
}

// Define a form type separate from Product
interface ProductForm {
  title: string;
  category: string;
  price: number;
  discountPercentage: number;
  weight: number;
  brand: string;
  image: string; // single input for image
}

export default function AddProduct({ onProductAdded }: Props) {
  const [form, setForm] = useState<ProductForm>({
    title: "",
    category: "",
    price: 0,
    discountPercentage: 0,
    weight: 0,
    brand: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "discountPercentage" || name === "weight"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("https://dummyjson.com/products/add", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        images: [form.image], // ✅ send image as array
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data: Product) => {
        console.log("Product created:", data);
        alert("Product added successfully!");

        // Reset form
        setForm({
          title: "",
          category: "",
          price: 0,
          discountPercentage: 0,
          weight: 0,
          brand: "",
          image: "",
        });

        onProductAdded(data); // ✅ send product to parent
      })
      .catch((err) => {
        console.error("Error adding product:", err);
        alert("Failed to add product");
      });
  };

  return (
    <div className="flex justify-center items-center">
      <div className="p-4 rounded w-full max-sm:w-10/12 bg-primaryColor-50 shadow mt-4">
        <h2 className="text-xl flex justify-center font-bold mb-4">Add Product</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 flex justify-center flex-col"
        >
          <input
            className="border border-gray-300 p-2 w-full"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            className="border border-gray-300 p-2 w-full"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />

          <label htmlFor="price" className="block font-medium text-gray-700">
            Price
          </label>
          <input
            className="border border-gray-300 p-2 w-full"
            name="price"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />

          <label
            htmlFor="discountPercentage"
            className="block font-medium text-gray-700"
          >
            Discount Percentage
          </label>
          <input
            className="border border-gray-300 p-2 w-full"
            name="discountPercentage"
            placeholder="Discount Percentage"
            type="number"
            value={form.discountPercentage}
            onChange={handleChange}
            required
          />

          <label htmlFor="weight" className="block font-medium text-gray-700">
            Weight
          </label>
          <input
            className="border border-gray-300 p-2 w-full"
            name="weight"
            placeholder="Weight"
            type="number"
            value={form.weight}
            onChange={handleChange}
            required
          />

          <input
            className="border border-gray-300 p-2 w-full"
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
            required
          />

          <input
            className="border border-gray-300 p-2 w-full"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="bg-primaryColor-500 flex justify-center items-center text-white px-4 py-2 rounded"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
