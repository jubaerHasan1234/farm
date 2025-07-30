
import Image from 'next/image';

export default function FarmersCard(){
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative">
                <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face"
                    alt="Rahim Ahmed"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        <i className="fas fa-certificate mr-1"></i>Certified
                    </span>
                </div>
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Rahim Ahmed
                    </h3>
                    <div className="flex items-center text-yellow-400">
                        <i className="fas fa-star"></i>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">4.8</span>
                    </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                    <i className="fas fa-map-marker-alt mr-2"></i>Sylhet, Bangladesh
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Specializes in organic vegetables and has been farming for over 15 years. Known for premium
                    tomatoes and leafy greens.
                </p>
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Farm Size:</span> 5 acres
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Products:</span> 12
                    </div>
                </div>
                <div className="flex space-x-2 mb-4">
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs">
                        Vegetables
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                        Organic
                    </span>
                </div>
                <div className="flex space-x-3">
                    <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition">
                        View Products
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <i className="fas fa-phone"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}