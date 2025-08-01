import Link from "next/link";

const BreadcrumbCreate = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-gray-500 hover:text-primary-600">
              Home
            </Link>
          </li>
          <li>
            <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
          </li>
          <li>
            <Link
              href="/manage"
              className="text-gray-500 hover:text-primary-600"
            >
              Manage Products
            </Link>
          </li>
          <li>
            <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
          </li>
          <li className="text-gray-900 dark:text-white">Add Product</li>
        </ol>
      </nav>
    </div>
  );
};

export default BreadcrumbCreate;
