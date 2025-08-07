"use client";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
export default function ActiveAndInactive({ product, setProducts, products }) {
  const [loading, setLoading] = useState(false);
  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/active", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: product._id,
          activeStatus: !product.activeStatus,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setProducts(
          products.map((p) =>
            p._id === result.product._id
              ? { ...p, activeStatus: result.product.activeStatus }
              : p
          )
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
  };

  return (
    <button
      onClick={handleToggleStatus}
      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
    >
      {loading ? (
        <ClipLoader speedMultiplier={0.5} size={20} color="#4fa94d" />
      ) : (
        <i
          className={
            product?.activeStatus
              ? "fas fa-eye-slash text-gray-400 hover:text-gray-600"
              : "fas fa-eye text-gray-400 hover:text-gray-600"
          }
        ></i>
      )}
    </button>
  );
}
