"use client";

import { useEffect, useState } from "react";
import RelatedProductCart from "./RelatedProductCart";

export default function RelatedProducts({
  currentProductId,
  currentProductFeatures,
}) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentProductId || !currentProductFeatures?.length) {
      setLoading(false);
      return;
    }

    const primaryFeature = currentProductFeatures[0];

    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch user favorites first
        const favoritesRes = await fetch("/api/favorites", {
          cache: "no-store",
        });

        let favoritesData = [];
        if (favoritesRes.ok) {
          const rawData = await favoritesRes.json();
          // ✅ FIX: Access the nested `favorites` array from the API response
          if (rawData && Array.isArray(rawData.favorites)) {
            favoritesData = rawData.favorites;
          } else {
            console.warn(
              "API for favorites did not return a valid array. Assuming no favorites."
            );
          }

          // Create a Set of favorite product IDs for efficient lookup
          const favoriteIdSet = new Set(
            favoritesData.map((fav) => fav.productId)
          );
          setFavoriteIds(favoriteIdSet);
        } else {
          console.warn("Could not fetch favorites. Assuming no favorites.");
        }

        // Fetch related products with the corrected endpoint
        const relatedRes = await fetch(
          `/api/realated?feature=${primaryFeature}&productId=${currentProductId}`,
          { cache: "no-store" }
        );

        if (!relatedRes.ok) {
          const errorText = await relatedRes.text();
          console.error(
            "API call returned a non-OK status:",
            relatedRes.status,
            "Response text:",
            errorText
          );
          throw new Error(`API call failed with status: ${relatedRes.status}`);
        }

        const relatedData = await relatedRes.json();
        setRelatedProducts(relatedData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(`Failed to load products. Please try again. (${err.message})`);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [currentProductId, currentProductFeatures]);

  if (loading) {
    return (
      <div className="mt-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading related products...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return (
      <div className="mt-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No related products found.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <RelatedProductCart
            key={product._id}
            product={product}
            isFavorite={favoriteIds.has(product._id)}
          />
        ))}
      </div>
    </div>
  );
}
