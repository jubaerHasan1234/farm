'use client';

import { useState } from 'react';

const SortAndViewsOption = () => {
  const [sortOption, setSortOption] = useState('Featured');
  const [viewMode, setViewMode] = useState('grid');

  const sortOptions = [
    'Featured',
    'Price: Low to High',
    'Price: High to Low',
    'Newest First',
    'Rating'
  ];

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <p className="text-gray-600 dark:text-gray-400">
        Showing 1-12 of 48 products
      </p>
      <div className="flex items-center space-x-4">
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          {sortOptions.map((option) => (
            <option key={option}>{`Sort by: ${option}`}</option>
          ))}
        </select>
        <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
          <button
            onClick={toggleViewMode}
            className={`p-2 ${
              viewMode === 'grid'
                ? 'bg-primary-600 text-white rounded-l-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg'
            }`}
          >
            <i className="fas fa-th"></i>
          </button>
          <button
            onClick={toggleViewMode}
            className={`p-2 ${
              viewMode === 'list'
                ? 'bg-primary-600 text-white rounded-r-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg'
            }`}
          >
            <i className="fas fa-list"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortAndViewsOption;