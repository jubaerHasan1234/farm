"use client";

import ProductCreateAndEdit from "@/components/common/ProductCreateAndEdit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

export default function EditProduct({ params }) {
  const id = params.id;
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(null);
  useEffect(() => {
    if (!id) return;

    async function getProductById(productId) {
      try {
        const res = await fetch(`/api/manage-products/${productId}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        setProduct(data.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    getProductById(id);
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader speedMultiplier={0.5} size={50} color="#4fa94d" />
      </div>
    );
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!product) return <div className="p-4">Product not found</div>;
  const onSaveProduct = async (productData) => {
    try {
      setEditLoading(true);
      const response = await fetch("/api/manage-products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      const data = await response.json();

      if (!response.ok) {
        setEditLoading(false);
        setEditError(data.error);
      } else {
        setEditSuccess("Successfully!");
        setEditLoading(false);
        router.back();
      }
    } catch (error) {
      const errorData = await error.json();
      setEditError(errorData.error);
      setEditLoading(false);
      console.error("Error creating product:", error);
    }
  };
  return (
    <ProductCreateAndEdit
      product={product}
      onCancel={() => router.back()}
      loading={editLoading}
      error={editError}
      success={editSuccess}
      onSave={onSaveProduct}
    />
  );
}
