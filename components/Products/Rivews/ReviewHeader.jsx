"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners"; // Assuming you have this library installed

export default function ReviewHeader({ reviews, productId, session }) {
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(true);

  const loggedInUser = session?.user;

  useEffect(() => {
    async function checkStatus() {
      if (!loggedInUser) {
        setLoading(false);
        return;
      }

      // First, check if the user has already reviewed
      const userHasReviewed = reviews.some(
        (review) => String(review.user._id) === String(loggedInUser.id)
      );
      setHasUserReviewed(userHasReviewed);

      // If the user hasn't reviewed, check for purchase status
      if (!userHasReviewed) {
        try {
          const checkPurchase = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || ""
            }/api/review/${productId}/purchase-status`,
            {
              cache: "no-store", // Ensure we always get the latest data
            }
          );

          if (checkPurchase.ok) {
            const data = await checkPurchase.json();
            setHasPurchased(data.hasPurchased);
          }
        } catch (error) {
          console.error("Failed to check purchase status:", error);
        }
      }
      setLoading(false);
    }

    checkStatus();
  }, [loggedInUser, productId, reviews]);

  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Customer Reviews
      </h2>
      {loading ? (
        <ClipLoader size={24} color="#3B82F6" />
      ) : hasUserReviewed ? (
        <button
          className="bg-gray-400 cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium"
          disabled
        >
          Review Submitted
        </button>
      ) : hasPurchased ? (
        <Link
          href={`/rating/${productId}`}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Write a Review
        </Link>
      ) : (
        <button
          className="bg-gray-400 cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium"
          disabled
        >
          Write a Review
        </button>
      )}
    </div>
  );
}
