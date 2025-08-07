"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const categories = [
    "All Categories",
    "Vegetables",
    "Fruits",
    "Grains",
    "Dairy",
  ];
  const router = useRouter(); // Initialize the router hook

  const handleSearch = (e) => {
    e.preventDefault();

    // Construct the search query string
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    if (selectedCategory !== "All Categories") {
      params.set("category", selectedCategory.toLowerCase());
    }

    // Navigate to the products page with the query parameters
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <form
        onSubmit={handleSearch}
        className="flex rounded-lg overflow-hidden shadow-lg"
      >
        <input
          type="text"
          placeholder="Search for vegetables, fruits, farmers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-6 py-4 text-gray-900 text-lg focus:outline-none"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-4 text-gray-900 border-l border-gray-300 focus:outline-none"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-primary-700 hover:bg-primary-800 px-8 py-4 transition"
        >
          <i className="fas fa-search text-xl"></i>
        </button>
      </form>
    </div>
  );
}
