import Image from "next/image";

const Summary = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Order Summary
      </h2>

      {/* Product Details */}
      <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <Image
          src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=80&h=80&fit=crop"
          alt="Fresh Tomatoes"
          width={80}
          height={80}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Fresh Tomatoes
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            By Rahim's Farm
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Quantity: 5 kg
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900 dark:text-white">৳225</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">৳45/kg</p>
        </div>
      </div>

      {/* Booking Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Booking Date:
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            Dec 20, 2024
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Delivery Date:
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            Dec 22, 2024
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Delivery Address:
          </span>
          <span className="font-medium text-gray-900 dark:text-white text-right">
            123 Main St, Dhaka
          </span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
          <span className="text-gray-900 dark:text-white">৳225</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Delivery Fee:
          </span>
          <span className="text-gray-900 dark:text-white">৳50</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Service Fee:</span>
          <span className="text-gray-900 dark:text-white">৳25</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-600 pt-2">
          <span>Total:</span>
          <span>৳300</span>
        </div>
      </div>

      {/* Edit Button */}
      <button className="w-full mt-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 rounded-lg font-medium transition">
        <i className="fas fa-edit mr-2"></i>Edit Order Details
      </button>
    </div>
  );
};

export default Summary;
