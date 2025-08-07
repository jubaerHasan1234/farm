"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ClipLoader } from "react-spinners";

// Helper to format price
const formatPrice = (price) => `৳${Number(price).toFixed(2)}`;

export default function ReviewForm({ product, user }) {
  // Renamed from Review, receives product prop
  const router = useRouter();

  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingText, setRatingText] = useState("Click to rate this product");
  const [ratingError, setRatingError] = useState("");
  const [commentError, setCommentError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  // Function to update rating text based on selected stars
  const updateRatingText = useCallback((rating) => {
    switch (rating) {
      case 1:
        setRatingText("1 star - Poor");
        break;
      case 2:
        setRatingText("2 stars - Fair");
        break;
      case 3:
        setRatingText("3 stars - Good");
        break;
      case 4:
        setRatingText("4 stars - Very Good");
        break;
      case 5:
        setRatingText("5 stars - Excellent");
        break;
      default:
        setRatingText("Click to rate this product");
        break;
    }
  }, []);

  const handleRatingClick = useCallback(
    (rating) => {
      setSelectedRating(rating);
      updateRatingText(rating);
      setRatingError(""); // Clear error when rating is selected
    },
    [updateRatingText]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setRatingError("");
      setCommentError("");

      if (selectedRating === 0) {
        setRatingError("Please select a rating.");
        setSubmitting(false);
        return;
      }
      if (comment.trim() === "") {
        setCommentError("Please enter your comment.");
        setSubmitting(false);
        return;
      }

      try {
        const reviewData = {
          rating: selectedRating,
          comment: comment.trim(),
        };

        // Use product._id from the prop for the API endpoint
        const response = await fetch(`/api/review/${product._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to submit review.");
        }

        router.back(); // Redirect to orders page after submission
      } catch (err) {
        console.error("Error submitting review:", err);
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    },
    [selectedRating, comment, product?._id, router]
  ); // Add product?._id to dependencies

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>

        {/* Product Info (for context) */}
        {product && ( // Ensure product exists before accessing its properties
          <div className="flex items-center space-x-4 mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <Image
              src={
                product.images?.[0] ||
                "https://placehold.co/80x80/e0e0e0/000000?text=Product"
              }
              alt={product.productName || "Product Image"}
              width={80}
              height={80}
              className="rounded-md object-cover w-[80px] h-[80px]"
            />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {product.productName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {product.unit
                  ? `Price: ${formatPrice(product.price)}/${product.unit}`
                  : `Price: ${formatPrice(product.price)}`}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="rating"
              className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >
              Rate this product
            </label>
            <div className="star-rating flex items-center gap-1 mb-2">
              {/* --- FIX: Changed map order from [5,4,3,2,1] to [1,2,3,4,5] --- */}
              {[1, 2, 3, 4, 5].map((starValue) => (
                <label
                  key={starValue}
                  htmlFor={`star${starValue}`}
                  title={`${starValue} stars - ${
                    starValue === 5
                      ? "Excellent"
                      : starValue === 4
                      ? "Very Good"
                      : starValue === 3
                      ? "Good"
                      : starValue === 2
                      ? "Fair"
                      : "Poor"
                  }`}
                  className="star-label cursor-pointer text-3xl transition-all duration-200 hover:scale-110"
                  onClick={() => handleRatingClick(starValue)}
                >
                  <i
                    className={`${
                      selectedRating >= starValue ? "fas" : "far"
                    } fa-star ${
                      selectedRating >= starValue
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  ></i>
                </label>
              ))}
            </div>
            <p
              className="text-sm text-gray-600 dark:text-gray-400 mb-1"
              id="ratingText"
            >
              {ratingText}
            </p>
            {ratingError && (
              <p className="text-red-500 text-xs italic">{ratingError}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="comment"
              className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
            >
              Comment
            </label>
            <textarea
              id="comment"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
              placeholder="Write your review here..."
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setCommentError(""); // Clear error on change
              }}
              required
            ></textarea>
            {commentError && (
              <p className="text-red-500 text-xs italic">{commentError}</p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full bg-green-600 hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-900 text-white py-2 rounded-md font-semibold transition
            ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={submitting}
          >
            {submitting ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
        {/* Close Button */}
        <button
          aria-label="Close modal"
          onClick={() => router.back()} // Use router.back() for Next.js navigation
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <i className="fas fa-arrow-right"></i>
        </button>
        {error && (
          <p className="text-red-500 text-xs italic text-center mt-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
