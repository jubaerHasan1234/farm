import Link from "next/link";

const ManageHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Manage Products
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your product listings and inventory
        </p>
      </div>
      <Link
        href="/create"
        className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
      >
        <i className="fas fa-plus mr-2"></i>
        Add New Product
      </Link>
    </div>
  );
};

export default ManageHeader;
