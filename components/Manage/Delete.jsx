"use client";

import { useState } from "react";
import { ClipLoader } from "react-spinners";

export default function Delete({ product, setProducts, products }) {
  const [loading, setLoading] = useState(false);
  async function handleDelete() {
    try {
      setLoading(true);
      const res = await fetch("/api/manage-products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setProducts(
          products.filter((p) => p._id !== result.deletedProduct._id)
        );
        setLoading(false);
      } else {
        console.error("Failed: " + result.error);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <button
      className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition disabled:opacity-50"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? (
        <ClipLoader speedMultiplier={0.5} size={20} color="#ff0000" />
      ) : (
        <i className="fas fa-trash"></i>
      )}
    </button>
  );
}
