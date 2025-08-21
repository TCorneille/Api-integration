import React, { useState } from "react";
import ProductList from "../components/DBProducts/ProductList";
import Sidebar from "../components/Sidebar";
import type { Product } from "../types/productTypes";

const ProductPage: React.FC = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to refresh products after add/edit/delete
  const handleProductUpdated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex">
      <Sidebar /> {/* Keep the sidebar */}
      
      <div className="flex-1 ml-10 p-4">
        <ProductList
          onSelectProduct={setSelectedProductId}
          // refreshKey={refreshKey}
          onProductUpdated={handleProductUpdated}
        />
      </div>
    </div>
  );
};

export default ProductPage;
