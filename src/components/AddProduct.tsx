
import { useState } from "react";
import type { Product } from "./types/productTypes";

interface Props {
  onProductAdded: (product: Product) => void; // pass product up
}

export default function AddProduct({ onProductAdded }: Props) {
  const [form, setForm] = useState<Product>({
    title: "",
    category: "",
    price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "price" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("https://dummyjson.com/products/add", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Product created:", data);
        alert("Product added successfully!");
        setForm({ title: "", category: "", price: 0 });

        onProductAdded(data); // ✅ send product to parent
      })
      .catch((err) => {
        console.error("Error adding product:", err);
        alert("Failed to add product");
      });
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-red-500 p-4 rounded w-1/2 shadow mt-4">
        <h2 className="text-xl flex justify-center font-bold mb-4">Add Product</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 flex justify-center flex-col"
        >
          <input
            className="border p-2 w-full"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            className="border p-2 w-full"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />
          <input
            className="border p-2 w-full"
            name="price"
            placeholder="Price"
            type="number"
            value={form.price}
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
