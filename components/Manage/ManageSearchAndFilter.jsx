"use client";

import { useDebounce } from "@/hooks";
import { useEffect, useState } from "react";

const ManageSearchAndFilter = ({
  search,
  category,
  status,
  onFilterChange,
}) => {
  const [tempSearch, setTempSearch] = useState(search);
  const [tempCategory, setTempCategory] = useState(category);
  const [tempStatus, setTempStatus] = useState(status);

  const debouncedSearch = useDebounce(tempSearch, 500);

  // Run filter when debounced search updates
  useEffect(() => {
    if (debouncedSearch !== search) {
      onFilterChange({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  // Sync temp states on URL param update
  useEffect(() => {
    setTempSearch(search);
    setTempCategory(category);
    setTempStatus(status);
  }, [search, category, status]);

  const handleApplyFilters = () => {
    onFilterChange({
      category: tempCategory,
      status: tempStatus,
      page: 1,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="Search products..."
              value={tempSearch}
              onChange={(e) => setTempSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>

        {/* Category Select */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Category
          </label>
          <select
            id="category"
            value={tempCategory}
            onChange={(e) => setTempCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
            <option value="herbs">Herbs</option>
            <option value="honey">Honey</option>
          </select>
        </div>

        {/* Status Select */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Status
          </label>
          <select
            id="status"
            value={tempStatus}
            onChange={(e) => setTempStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        {/* Apply Button */}
        <div className="flex items-end">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageSearchAndFilter;
