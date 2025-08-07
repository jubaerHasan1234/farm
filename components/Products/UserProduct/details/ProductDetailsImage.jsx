"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductDetailsActionButton from "./ProductDetailsActionButton";
import ProductImage from "./ProductImage";
import Quantity from "./Quantity";

const ProductDetailsImage = ({ product, user }) => {
  const [quantity, setQuantity] = useState(1);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loadingPurchase, setLoadingPurchase] = useState(true);
  const { data: session } = useSession();

  const hasUserReviewed =
    session?.user &&
    product.reviews &&
    product.reviews.some((review) => {
      return String(review.user) === String(session?.user?.id);
    });

  // Fetch purchase status on component mount or when session changes
  useEffect(() => {
    async function checkPurchaseStatus() {
      if (!session?.user || hasUserReviewed) {
        setLoadingPurchase(false);
        return;
      }
      try {
        const res = await fetch(`/api/review/${product._id}/purchase-status`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setHasPurchased(data.hasPurchased);
        }
      } catch (error) {
        console.error("Failed to check purchase status:", error);
      } finally {
        setLoadingPurchase(false);
      }
    }
    checkPurchaseStatus();
  }, [session, product._id, hasUserReviewed]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Product Images */}
      <ProductImage images={product?.images} />

      {/* Product Information */}
      <div className="space-y-6">
        {/* Product Header */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            {product.features?.map((feature, idx) => (
              <span
                key={idx}
                className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium capitalize"
              >
                {feature}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {product.productName}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Produced by{" "}
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              {`${user?.firstName} ${user?.lastName}` ||
                user?.name ||
                "Unknown Farm"}
            </span>
          </p>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => {
                if (product.rating >= i + 1) {
                  return <i key={i} className="fas fa-star" />; // full star
                } else if (product.rating > i && product.rating < i + 1) {
                  return <i key={i} className="fas fa-star-half-alt" />; // half star
                } else {
                  return <i key={i} className="far fa-star" />; // empty star
                }
              })}
            </div>

            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {product.rating?.toFixed(1) || "0.0"}
            </span>
          </div>
          <span className="text-gray-500 dark:text-gray-400">
            ({product.reviews?.length || 0} reviews)
          </span>

          {/* Conditional rendering for the review button based on both review and purchase status */}
          {loadingPurchase ? (
            <span className="text-gray-500 dark:text-gray-400">
              Checking...
            </span>
          ) : hasUserReviewed ? (
            <button
              className="text-gray-500 dark:text-gray-400 cursor-not-allowed"
              disabled
            >
              Review Submitted
            </button>
          ) : hasPurchased ? (
            <Link
              href={`/rating/${product._id}`}
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Write a review
            </Link>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">
              (Purchase to review)
            </span>
          )}
        </div>

        {/* Price and Stock */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                ৳{product.price * quantity}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Available Stock
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {product.stock} {product.unit}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
            <i className="fas fa-map-marker-alt mr-2"></i>
            <span>{product.farmLocation}</span>
          </div>
        </div>

        {/* Quantity and Actions */}
        <Quantity
          quantity={quantity}
          setQuantity={setQuantity}
          stock={product.stock}
        />
        <ProductDetailsActionButton product={product} quantity={quantity} />
      </div>
    </div>
  );
};

export default ProductDetailsImage;
