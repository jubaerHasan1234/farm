import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
// Component for a single favorite product card
const FavouriteProductCard = ({
  product,
  onRemove,
  onAddToCart,
  onRemoveFromCart,
  isInCart,
  isRemovingFavorite,
  isProcessingCart,
}) => (
  <div className="flex items-center bg-white p-4 rounded-lg shadow-md dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
    <div className="flex-shrink-0 w-24 h-24 relative mr-4">
      <Image
        src={
          product.image ||
          "https://placehold.co/100x100/e2e8f0/0f172a?text=No+Image"
        }
        alt={product.productName || "Product Image"}
        width={100}
        height={100}
        className="rounded-md object-cover"
      />
    </div>
    <div className="flex-grow">
      <h2 className="text-lg font-semibold dark:text-white">
        {product.productName || "Unnamed Product"}
      </h2>
      <p className="text-gray-500 text-sm dark:text-gray-400">
        {product.unit || ""}
      </p>
      <div className="flex items-baseline mt-2">
        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
          Tk. {product.price || "0"}
        </span>
        {product.originalPrice && (
          <span className="text-gray-500 line-through ml-2 dark:text-gray-400">
            Tk. {product.originalPrice}
          </span>
        )}
      </div>

      {isInCart ? (
        <button
          className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center transition duration-300 dark:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onRemoveFromCart(product.productId)}
          disabled={isProcessingCart}
        >
          <Trash2 className="text-xl mr-2" size={16} />
          {isProcessingCart ? "Removing..." : "Remove from Cart"}
        </button>
      ) : (
        <button
          className="mt-3 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center transition duration-300 dark:bg-primary-700 dark:hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onAddToCart(product)}
          disabled={isProcessingCart}
        >
          <ShoppingCart className="text-xl mr-2" size={16} />
          {isProcessingCart ? "Adding..." : "Add to Cart"}
        </button>
      )}
    </div>
    <button
      className={`text-gray-400 hover:text-red-500 transition duration-300 ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 ${
        isRemovingFavorite ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={() => onRemove(product.productId)}
      disabled={isRemovingFavorite}
    >
      <Trash2 size={24} />
    </button>
  </div>
);
export default FavouriteProductCard;
