"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const initialCategories = [
  {
    title: "Vegetables",
    icon: "fas fa-carrot",
    backgroundColor: "bg-green-100 dark:bg-green-900",
    hoverBackgroundColor:
      "group-hover:bg-green-200 dark:group-hover:bg-green-800",
    textColor: "text-gray-900 dark:text-white",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    title: "Fruits",
    icon: "fas fa-apple-alt",
    backgroundColor: "bg-red-100 dark:bg-red-900",
    hoverBackgroundColor: "group-hover:bg-red-200 dark:group-hover:bg-red-800",
    textColor: "text-gray-900 dark:text-white",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    title: "Grains",
    icon: "fas fa-seedling",
    backgroundColor: "bg-yellow-100 dark:bg-yellow-900",
    hoverBackgroundColor:
      "group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800",
    textColor: "text-gray-900 dark:text-white",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    title: "Dairy",
    icon: "fas fa-cheese",
    backgroundColor: "bg-blue-100 dark:bg-blue-900",
    hoverBackgroundColor:
      "group-hover:bg-blue-200 dark:group-hover:bg-blue-800",
    textColor: "text-gray-900 dark:text-white",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Honey",
    icon: "fas fa-jar",
    backgroundColor: "bg-purple-100 dark:bg-purple-900",
    hoverBackgroundColor:
      "group-hover:bg-purple-200 dark:group-hover:bg-purple-800",
    textColor: "text-gray-900 dark:text-white",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    title: "Herbs",
    icon: "fas fa-leaf",
    backgroundColor: "bg-orange-100 dark:bg-orange-900",
    hoverBackgroundColor:
      "group-hover:bg-orange-200 dark:group-hover:bg-orange-800",
    textColor: "text-gray-900 dark:text-white",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
];

const Categories = () => {
  const [categories, setCategories] = useState(initialCategories);
  const router = useRouter();

  // Fetch category counts from your API on component mount
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (res.ok && data.success) {
          // Update the count for each category
          const updatedCategories = initialCategories.map((cat) => {
            const apiCategory = data.data.find(
              (apiCat) => apiCat.category === cat.title
            );
            return {
              ...cat,
              count: `${apiCategory ? apiCategory.count : 0}+`,
            };
          });
          setCategories(updatedCategories);
        }
      } catch (error) {
        console.error("Failed to fetch category counts:", error);
      }
    };

    fetchCategoryCounts();
  }, []);

  // Handle the click to redirect to the products page
  const handleCategoryClick = (categoryTitle) => {
    const categoryQuery = categoryTitle.toLowerCase();
    router.push(`/products?category=${categoryQuery}`);
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover fresh, locally-sourced produce across various categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={`/products?category=${category.title.toLowerCase()}`}
              passHref
              className="group cursor-pointer"
            >
              <div
                className={`${category.backgroundColor} ${category.hoverBackgroundColor} rounded-2xl p-6 text-center transition`}
              >
                <i
                  className={`${category.icon} text-3xl ${category.iconColor} mb-3`}
                ></i>
                <h3 className={category.textColor}>{category.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.count} items
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
