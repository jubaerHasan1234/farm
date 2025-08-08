"use client";
import { useEffect, useState } from "react";

// Main App component to handle data fetching and state
export default function Count() {
  const [counts, setCounts] = useState({
    userCount: 0,
    productCount: 0,
    farmLocationCount: 0,
    customerCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Function to fetch data from your API endpoint
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/farmers");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      const { data } = result;

      setCounts({
        userCount: data.userCount,
        productCount: data.productCount,
        farmLocationCount: data.farmLocationCount,
        customerCount: data.customerCount,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-green-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
          <p className="text-xl text-green-100">
            Making a difference in communities across Bangladesh
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{counts.userCount}+</div>
            <div className="text-green-200">Active Farmers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {counts.customerCount}+
            </div>
            <div className="text-green-200">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {counts.farmLocationCount}+
            </div>
            <div className="text-green-200">Districts Covered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {counts.productCount}+
            </div>
            <div className="text-green-200">Products Available</div>
          </div>
        </div>
      </div>
    </div>
  );
}
