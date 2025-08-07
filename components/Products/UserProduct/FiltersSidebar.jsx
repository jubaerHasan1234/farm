// File: components/FiltersSidebar.js
"use client";

import { useEffect, useState } from "react";

const FiltersSidebar = ({ currentFilters, onFilterChange }) => {
  const [categoryCounts, setCategoryCounts] = useState({});
  // New local state to hold filter selections
  const [localFilters, setLocalFilters] = useState(currentFilters);

  // Sync local state with URL state whenever the URL changes
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  // Fetch dynamic category counts on mount
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) {
          const countsMap = data.data.reduce((acc, curr) => {
            acc[curr.category] = curr.count;
            return acc;
          }, {});
          setCategoryCounts(countsMap);
        }
      } catch (error) {
        console.error("Failed to fetch category counts:", error);
      }
    };
    fetchCounts();
  }, []);

  // Handlers now update the local state, not the URL
  const handleCategoryChange = (category) => {
    setLocalFilters((prevFilters) => {
      const categoryValue = category.toLowerCase(); // Ensure value is lowercase
      const newCategories = prevFilters.categories.includes(categoryValue)
        ? prevFilters.categories.filter((cat) => cat !== categoryValue)
        : [...prevFilters.categories, categoryValue];
      return { ...prevFilters, categories: newCategories };
    });
  };

  const handlePriceChange = (priceRange) => {
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      price: prevFilters.price === priceRange ? "" : priceRange,
    }));
  };

  const handleLocationChange = (e) => {
    const newLocation =
      e.target.value === "All Locations" ? "" : e.target.value;
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      location: newLocation,
    }));
  };

  const handleOrganicChange = () => {
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      organic: !prevFilters.organic,
    }));
  };

  // This function is called when the "Apply Filters" button is clicked
  const handleApplyFilters = () => {
    const newParams = {
      category: localFilters.categories.length
        ? localFilters.categories.join(",")
        : "",
      priceRange: localFilters.price || "",
      location: localFilters.location || "",
      organic: localFilters.organic ? "true" : "",
    };
    onFilterChange(newParams);
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filters
        </h3>

        {/* Category Filter */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Category
          </h4>
          <div className="space-y-2">
            {["Vegetables", "Fruits", "Grains", "Dairy"].map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.categories.includes(
                    category.toLowerCase()
                  )}
                  onChange={() => handleCategoryChange(category)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {category} ({categoryCounts[category] || 0})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Price Range
          </h4>
          <div className="space-y-2">
            {["Under ৳30", "৳30 - ৳50", "৳50 - ৳100", "Over ৳100"].map(
              (priceRange) => (
                <label key={priceRange} className="flex items-center">
                  <input
                    type="radio"
                    name="price"
                    checked={localFilters.price === priceRange}
                    onChange={() => handlePriceChange(priceRange)}
                    className="border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {priceRange}
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Location
          </h4>
          <select
            value={localFilters.location}
            onChange={handleLocationChange}
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
              checked={localFilters.organic}
              onChange={handleOrganicChange}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Organic Only
            </span>
          </label>
        </div>

        <button
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition"
          onClick={handleApplyFilters} // Call the new handler
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FiltersSidebar;
