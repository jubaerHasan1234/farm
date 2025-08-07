import Link from "next/link";

const NoProduct = ({
  message = "No products found",
  showButton = false,
  buttonText = "Add New Product",
  buttonHref = "/create",
}) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-full h-full"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900">{message}</h3>
      {showButton && (
        <div className="mt-6">
          <Link
            href={buttonHref}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {buttonText}
          </Link>
        </div>
      )}
    </div>
  );
};

export default NoProduct;
