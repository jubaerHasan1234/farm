import Link from "next/link";

const HomeProductHeader = () => {
  return (
    <div className="flex justify-between items-center mb-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Featured Products
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Fresh picks from our local farmers
        </p>
      </div>
      <Link
        href="/products"
        className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
      >
        View All <i className="fas fa-arrow-right ml-1"></i>
      </Link>
    </div>
  );
};

export default HomeProductHeader;
