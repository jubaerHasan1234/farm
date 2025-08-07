"use client";

import { useGlobal } from "@/components/context/GlobalProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Favorite = ({ product, isFavorite: initialIsFavorite }) => {
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const { updateFavoriteCount } = useGlobal(); // ✅ count updater
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = async () => {
    if (!session) return router.push("/login");
    try {
      setLoading(true);

      const res = await fetch("/api/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isFavorite
            ? { productId: product._id }
            : {
                productId: product._id,
                productName: product.productName,
                image: product.images?.[0] || "",
                unit: product.unit,
                price: product.price,
                stock: product.stock,
                reviews: product.reviews ?? 0,
                rating: product.rating ?? 0,
              }
        ),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setIsFavorite(!isFavorite);

      // ✅ Update global favorite count
      updateFavoriteCount((prev) => (isFavorite ? prev - 1 : prev + 1));
    } catch (error) {
      console.error(
        isFavorite
          ? "Error removing from favorites"
          : "Error adding to favorites",
        error
      );
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
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
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
