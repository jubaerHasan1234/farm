import Image from "next/image";

const Summary = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Order Details
      </h2>

      {/* Product */}
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
        </div>
      </div>

      {/* Delivery Information */}
      <div className="space-y-3 mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Delivery Information
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Delivery Date:
            </span>
            <span className="text-gray-900 dark:text-white">Dec 22, 2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Delivery Time:
            </span>
            <span className="text-gray-900 dark:text-white">
              10:00 AM - 12:00 PM
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Address:</span>
            <span className="text-gray-900 dark:text-white text-right">
              123 Main St, Dhaka 1000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
