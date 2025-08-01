import Image from "next/image";

const ManageProductCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="relative">
        <Image
          src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=200&fit=crop"
          alt="Fresh Tomatoes"
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Active
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <button className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <i className="fas fa-heart text-red-500"></i>
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Fresh Tomatoes
          </h3>
          <div className="flex items-center text-yellow-400">
            <i className="fas fa-star text-sm"></i>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              4.8 (23)
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Organic • Vegetables
        </p>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ৳45
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              /kg
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Stock: 50kg
          </span>
        </div>
        <div className="flex space-x-2">
          <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition text-sm">
            <i className="fas fa-edit mr-1"></i>Edit
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
            <i className="fas fa-eye"></i>
          </button>
          <button className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageProductCard;
