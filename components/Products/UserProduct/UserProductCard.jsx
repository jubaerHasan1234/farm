"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCart, Favorite } from "./index";

const UserProductCard = ({ product, isInCartInitial, isFavoriteInitial }) => {
  // console.log(product);

  // Use first image or fallback
  const imageUrl =
    product?.images && product?.images.length > 0
      ? product.images[0]
      : "https://via.placeholder.com/400x300?text=No+Image";

  // Determine feature badge text
  const featureBadge =
    product?.features && product.features.length > 0
      ? product.features.includes("organic")
        ? "Organic"
        : product.features[0].replace(/-/g, " ")
      : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="relative">
        {featureBadge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {featureBadge}
            </span>
          </div>
        )}

        <Image
          src={
            imageUrl.startsWith("http")
              ? imageUrl
              : process.env.NEXT_PUBLIC_BASE_URL + imageUrl
          }
          alt={product?.productName}
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        <div className="absolute top-3 right-3">
          <Favorite product={product} isFavorite={isFavoriteInitial} />
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Link href={`/products/${product?._id}`}>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {product?.productName}
            </h3>
          </Link>
          <div className="flex items-center text-yellow-400">
            <i className="fas fa-star text-sm" />
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              {product?.rating ?? 0}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Location: {product?.farmLocation || "Unknown"}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {product?.price}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              /{product?.unit}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Stock: {product?.stock} {product?.unit}
          </span>
        </div>

        <AddToCart product={product} isInCartInitial={isInCartInitial} />
      </div>
    </div>
  );
};

export default UserProductCard;
