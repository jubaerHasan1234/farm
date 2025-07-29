"use client";

import { useState } from "react";

const Favorite = ({ productId, isFavorite }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      //   api call
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`p-2 rounded-full shadow-md transition ${
        loading
          ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
          : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
      ) : (
        <i
          className={`far fa-heart ${
            isFavorite ? "text-red-500" : "text-gray-600 dark:text-gray-400"
          }`}
        />
      )}
    </button>
  );
};

export default Favorite;
