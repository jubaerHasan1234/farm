'use client';

import { useState } from 'react';

const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(2);
  const totalPages = 4;

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center mt-12">
      <nav aria-label="Pagination">
        <ul className="inline-flex items-center -space-x-px text-gray-600 dark:text-gray-300">
          <li>
            <button
              onClick={handlePrevClick}
              className={`px-3 py-2 ml-0 leading-tight border rounded-l-lg ${
                currentPage === 1
                  ? 'text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                  : 'text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          </li>

          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            return (
              <li key={page}>
                <button
                  onClick={() => handlePageClick(page)}
                  className={`px-3 py-2 leading-tight border ${
                    page === currentPage
                      ? 'text-white bg-primary-600 border-primary-600 hover:bg-primary-700 hover:text-white'
                      : 'text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                >
                  {page}
                </button>
              </li>
            );
          })}

          <li>
            <button
              onClick={handleNextClick}
              className={`px-3 py-2 leading-tight border rounded-r-lg ${
                currentPage === totalPages
                  ? 'text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                  : 'text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white'
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