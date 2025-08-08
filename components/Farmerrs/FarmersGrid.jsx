"use client";
import { useEffect, useState } from "react";
import LoadMore from "../Products/Rivews/LoadeMore";
import Count from "./Count";
import FarmersCard from "./FarmersCard";

// Main App component to hold all the logic and components
export default function FarmersGrid() {
  const [farmers, setFarmers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [counts, setCounts] = useState({
    userCount: 0,
    productCount: 0,
    farmLocationCount: 0,
  });

  const fetchFarmers = async (pageToFetch) => {
    setLoading(true);
    try {
      // Your API endpoint URL
      const response = await fetch(`/api/farmers?page=${pageToFetch}&limit=6`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      const { data, pagination } = result;
      const newFarmers = data.paginatedUsers;

      // Update the main farmer list
      if (pageToFetch === 1) {
        setFarmers(newFarmers);
      } else {
        setFarmers((prevFarmers) => [...prevFarmers, ...newFarmers]);
      }

      // Update counts for the Count component
      setCounts({
        userCount: data.userCount,
        productCount: data.productCount,
        farmLocationCount: data.farmLocationCount,
      });

      // Check if there are more pages to load
      setHasMore(pagination.users.currentPage < pagination.users.totalPages);
    } catch (error) {
      console.error("Failed to fetch farmers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchFarmers(1);
  }, []);

  // Handle "load more" button click
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFarmers(nextPage);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Our Farmers
        </h1>
        {/* Count section with dynamic data */}
        <Count
          activeFarmers={counts.userCount}
          districtsCovered={counts.farmLocationCount}
          productsAvailable={counts.productCount}
        />
        {/* All farmers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {farmers.map((farmer) => (
            <FarmersCard key={farmer._id} farmer={farmer} />
          ))}
        </div>
        {/* Load more button */}
        {hasMore && <LoadMore onClick={handleLoadMore} loading={loading} />}
      </div>
    </div>
  );
}
