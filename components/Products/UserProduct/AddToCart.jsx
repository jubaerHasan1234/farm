"use client";

import { useState } from "react";

const AddToCart = ({ product }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      //   api call
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`w-full py-2 rounded-lg font-medium transition ${
        loading
          ? "bg-primary-700 cursor-not-allowed"
          : "bg-primary-600 hover:bg-primary-700"
      }`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Adding...
        </div>
      ) : (
        "Add to Cart"
      )}
    </button>
  );
};

export default AddToCart;
