import Favorite from "@/components/Products/UserProduct/Favorite";
import Link from "next/link";
const RelatedProductCart = ({ product, isFavorite }) => {
  const imageUrl = product?.images?.[0] || "https://placehold.co/400x300";
  const rating = product?.rating || 0;
  const priceWithUnit = `৳${product?.price || 0}/${product?.unit || "unit"}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <img
          src={imageUrl}
          alt={product?.productName}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          {/* Render the Favorite button, passing the product and initial isFavorite status */}
          <Favorite product={product} isFavorite={isFavorite} />
        </div>
      </div>
      <div className="p-4">
        <Link
          href={`/products/${product?._id}`}
          className="font-semibold text-gray-900 dark:text-white mb-1"
        >
          {product?.productName}
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          By {product?.farmLocation}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            {priceWithUnit}
          </span>
          <div className="flex items-center text-yellow-400 text-sm">
            <i className="fas fa-star"></i>
            <span className="text-gray-600 dark:text-gray-400 ml-1">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProductCart;
