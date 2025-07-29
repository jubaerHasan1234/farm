'use client';

import { useState } from 'react';

const FiltersSidebar = () => {
  const [filters, setFilters] = useState({
    categories: [],
    price: '',
    location: 'All Locations',
    organic: false,
  });

  const handleCategoryChange = (category) => {
    setFilters((prev) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((cat) => cat !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  };

  const handlePriceChange = (price) => {
    setFilters((prev) => ({ ...prev, price }));
  };

  const handleLocationChange = (location) => {
    setFilters((prev) => ({ ...prev, location }));
  };

  const handleOrganicChange = () => {
    setFilters((prev) => ({ ...prev, organic: !prev.organic }));
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>

        {/* Category Filter */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Category</h4>
          <div className="space-y-2">
            {['Vegetables', 'Fruits', 'Grains', 'Dairy'].map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {category} ({getCategoryCount(category)})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Price Range</h4>
          <div className="space-y-2">
            {['Under ৳30', '৳30 - ৳50', '৳50 - ৳100', 'Over ৳100'].map((priceRange) => (
              <label key={priceRange} className="flex items-center">
                <input
                  type="radio"
                  name="price"
                  checked={filters.price === priceRange}
                  onChange={() => handlePriceChange(priceRange)}
                  className="border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{priceRange}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Location</h4>
          <select
            value={filters.location}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option>All Locations</option>
            <option>Dhaka</option>
            <option>Chittagong</option>
            <option>Sylhet</option>
            <option>Rangpur</option>
          </select>
        </div>

        {/* Organic Filter */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.organic}
              onChange={handleOrganicChange}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Organic Only</span>
          </label>
        </div>

        <button
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition"
          onClick={() => console.log('Apply filters:', filters)}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

const getCategoryCount = (category) => {
  const counts = {
    Vegetables: 45,
    Fruits: 32,
    Grains: 18,
    Dairy: 12,
  };
  return counts[category] || 0;
};

export default FiltersSidebar;