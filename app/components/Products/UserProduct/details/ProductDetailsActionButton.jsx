"use client";
export default function ProductDetailsActionButton() {
  return (
    <div className="space-y-3">
      <button className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg">
        <i className="fas fa-bolt mr-2"></i>
        Buy Now
      </button>
      <button className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-medium transition">
        <i className="fas fa-shopping-cart mr-2"></i>
        Add to Cart
      </button>
      <button className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-medium transition">
        <i className="far fa-heart mr-2"></i>
        Add to Favorite
      </button>
    </div>
  );
}
