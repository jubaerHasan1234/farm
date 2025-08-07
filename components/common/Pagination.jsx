"use client";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Limit pages to max 3 visible
  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage === 1) return [1, 2, 3];
    if (currentPage === totalPages)
      return [totalPages - 2, totalPages - 1, totalPages];

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center mt-12">
      <nav aria-label="Pagination">
        <ul className="inline-flex items-center -space-x-px text-gray-600 dark:text-gray-300">
          {/* Previous Button */}
          <li>
            <button
              onClick={() => handlePageClick(currentPage - 1)}
              className={`px-3 py-2 ml-0 leading-tight border rounded-l-lg ${
                currentPage === 1
                  ? "text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                  : "text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          </li>

          {/* Page Numbers */}
          {visiblePages.map((page) => (
            <li key={page}>
              <button
                onClick={() => handlePageClick(page)}
                className={`px-3 py-2 leading-tight border ${
                  page === currentPage
                    ? "text-white bg-green-600 border-green-600 hover:bg-green-700 hover:text-white"
                    : "text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                {page}
              </button>
            </li>
          ))}

          {/* Next Button */}
          <li>
            <button
              onClick={() => handlePageClick(currentPage + 1)}
              className={`px-3 py-2 leading-tight border rounded-r-lg ${
                currentPage === totalPages
                  ? "text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                  : "text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
              disabled={currentPage === totalPages}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
