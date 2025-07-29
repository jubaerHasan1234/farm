import ProductDetailsActionButton from "./ProductDetailsActionButton";
import ProductImage from "./ProductImage";
import Quantity from "./Quantity";

const ProductDetailsImage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Product Images */}
      <ProductImage />

      {/* Product Information */}
      <div className="space-y-6">
        {/* Product Header */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
              Organic
            </span>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
              Fresh
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Fresh Tomatoes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Produced by
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              Rahim's Farm
            </span>
          </p>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <i className="fas fa-star" key={i}></i>
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              4.8
            </span>
          </div>
          <span className="text-gray-500 dark:text-gray-400">
            (127 reviews)
          </span>
          <button className="text-primary-600 dark:text-primary-400 hover:underline">
            Write a review
          </button>
        </div>

        {/* Price and Stock */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                ৳45
              </span>
              <span className="text-lg text-gray-500 dark:text-gray-400">
                /kg
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Available Stock
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                50 kg
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
            <i className="fas fa-map-marker-alt mr-2"></i>
            <span>Sylhet, Bangladesh</span>
          </div>
        </div>

        {/* Quantity and Date Selection */}
        <Quantity />
        {/* Action Buttons */}
        <ProductDetailsActionButton />
      </div>
    </div>
  );
};

export default ProductDetailsImage;
