"use client";

// No local state needed, as it will be controlled by the parent
const SortAndViewsOption = ({
  currentSort,
  onSortChange,
  totalProducts,
  showProducts,
  viewMode,
  onViewModeChange,
}) => {
  const sortOptions = [
    "Featured",
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
    "Rating",
  ];

  const handleSortChange = (e) => {
    // Call the function from the parent to update the URL
    onSortChange({ sort: e.target.value });
  };

  const toggleViewMode = (mode) => {
    onViewModeChange(mode);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <p className="text-gray-600 dark:text-gray-400">
        {`Showing ${
          showProducts === 0 ? "0-" : "1-" + showProducts
        } of ${totalProducts} products `}
      </p>
      <div className="flex items-center space-x-4">
        <select
          // The value is now controlled by the parent's state
          value={currentSort}
          // The onChange event triggers the state change in the parent
          onChange={handleSortChange}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
          <button
            onClick={() => toggleViewMode("list")}
            className={`p-2 rounded-l-lg ${
              viewMode === "list"
                ? "bg-primary-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <i className="fas fa-th"></i>
          </button>
          <button
            onClick={() => toggleViewMode("grid")}
            className={`p-2 rounded-r-lg ${
              viewMode === "grid"
                ? "bg-primary-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
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
