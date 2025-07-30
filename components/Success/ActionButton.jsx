"use client";
import Link from "next/link";

const ActionButton = () => {
  const downloadReceipt = () => {
    // Implement your PDF download logic here
    console.log("Downloading receipt...");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button
        onClick={downloadReceipt}
        className="flex items-center justify-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
      >
        <i className="fas fa-download mr-2"></i>
        Download Receipt (PDF)
      </button>
      <Link
        href="/orders"
        className="flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition"
      >
        <i className="fas fa-list mr-2"></i>
        View All Orders
      </Link>
      <Link
        href="/"
        className="flex items-center justify-center px-8 py-3 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition"
      >
        <i className="fas fa-home mr-2"></i>
        Back to Home
      </Link>
    </div>
  );
};

export default ActionButton;
