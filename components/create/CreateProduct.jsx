"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ProductCreateAndEdit from "../common/ProductCreateAndEdit";

export default function CreateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();
  const onSaveProduct = async (productData) => {
    try {
      setLoading(true);
      const response = await fetch("/api/manage-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        setError(data.error);
      } else {
        setSuccess("Successfully!");
        setLoading(false);
        router.push("/manage");
      }
    } catch (error) {
      const errorData = await error.json();
      setError(errorData.error);
      setLoading(false);
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 text-white px-8 py-6">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-primary-100 mt-2">
            Share your fresh produce with customers
          </p>
        </div>

        {/* Form */}
        <ProductCreateAndEdit
          onSave={onSaveProduct}
          loading={loading}
          error={error}
          success={success}
        />
      </div>
    </div>
  );
}
