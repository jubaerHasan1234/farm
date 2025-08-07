// File: components/Search.js
"use client";

import { useDebounce } from "@/hooks"; // Adjust the import path as needed
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms debounce delay
  const searchRef = useRef(null);

  // Effect to fetch data when the debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      const fetchSuggestions = async () => {
        try {
          const res = await fetch(
            `/api/products?search=${debouncedSearchTerm}`
          );
          const data = await res.json();
          if (res.ok) {
            setSuggestions(data.data);
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          console.error("Failed to fetch search suggestions:", error);
          setSuggestions([]);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm]);

  // Handle clicks outside the search container to hide suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsInputFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  return (
    <div className="hidden sm:block relative" ref={searchRef}>
      <input
        type="text"
        placeholder="Search products..."
        className="w-44 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsInputFocused(true)}
      />
      <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>

      {/* Suggestion Dropdown */}
      {isInputFocused && (
        <ul className="absolute top-full left-0 mt-0.5 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {suggestions.length > 0 ? (
            suggestions.map((product) => (
              <li
                key={product._id}
                className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <Link
                  href={`/products/${product._id}`}
                  className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setSearchTerm("");
                    setSuggestions([]);
                    setIsInputFocused(false);
                  }}
                >
                  {product.images && product.images.length > 0 && (
                    <Image
                      src={product.images[0]}
                      alt={product.productName}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-md mr-3"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">
                    {product.productName}
                  </span>
                </Link>
              </li>
            ))
          ) : (
            // "No results" message
            <li className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No products found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
