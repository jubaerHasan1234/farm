import Link from "next/link";

const RelatedProductCart = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop"
          alt="Fresh Carrots"
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <button className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <i className="far fa-heart text-gray-600 dark:text-gray-400"></i>
          </button>
        </div>
      </div>
      <div className="p-4">
        <Link
          href="/products/1"
          className="font-semibold text-gray-900 dark:text-white mb-1"
        >
          Fresh Carrots
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          By Shumi's Garden
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            ৳35/kg
          </span>
          <div className="flex items-center text-yellow-400 text-sm">
            <i className="fas fa-star"></i>
            <span className="text-gray-600 dark:text-gray-400 ml-1">4.9</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProductCart;
