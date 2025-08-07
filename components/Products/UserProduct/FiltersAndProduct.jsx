// File: components/FiltersAndProduct.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FiltersSidebar,
  Pagination,
  SortAndViewsOption,
  UserProductCard,
} from "./index";

export default function FiltersAndProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState({
    showProducts: 0,
    allProducts: 0,
  });
  const [viewMode, setViewMode] = useState("grid");

  // FIX 1: Initialize cartItems and favoriteItems with an empty array
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);

  // Memoize filters from URL to prevent unnecessary re-renders
  const filters = useMemo(
    () => ({
      categories: searchParams.get("category")?.split(",") || [],
      price: searchParams.get("priceRange") || "",
      location: searchParams.get("location") || "",
      organic: searchParams.get("organic") === "true",
      sort: searchParams.get("sort") || "Newest First",
      page: parseInt(searchParams.get("page") || "1", 10),
    }),
    [searchParams]
  );

  // This function updates the URL with new parameters
  const updateURL = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.replace(`/products?${params.toString()}`);
  };

  // Effect to fetch products, cart, and favorites whenever the URL changes
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [productsRes, cartRes, favoriteRes] = await Promise.all([
          fetch(`/api/products?${searchParams.toString()}`),
          fetch("/api/cart"),
          fetch("/api/favorites"),
        ]);

        const productsData = await productsRes.json();
        setTotalProducts({
          showProducts: productsData.data.length,
          allProducts: productsData.totalProducts,
        });

        const cartData = await cartRes.json();
        const favoriteData = await favoriteRes.json();

        // FIX 2: Correctly access the 'cart' array from the cart API response
        if (cartData.success) {
          setCartItems(cartData.cart);
        }

        // FIX 3: Correctly access the 'favorites' array from the favorites API response
        if (favoriteData.success) {
          setFavoriteItems(favoriteData.favorites);
        }

        if (productsData.success) {
          setProducts(productsData.data);
          // FIX 4: Set the totalPages state from the API response
          if (productsData.totalPages) {
            setTotalPages(productsData.totalPages);
          }
        } else {
          setProducts([]);
          setTotalPages(1); // Reset total pages on failure
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setProducts([]);
        setCartItems([]);
        setFavoriteItems([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div
        className={`grid grid-cols-1 ${
          viewMode === "grid" ? "lg:grid-cols-4" : "lg:grid-cols-3"
        } gap-8`}
      >
        {viewMode === "grid" && (
          <FiltersSidebar currentFilters={filters} onFilterChange={updateURL} />
        )}
        <div className="lg:col-span-3">
          <SortAndViewsOption
            currentSort={filters.sort}
            onSortChange={updateURL}
            totalProducts={totalProducts.allProducts}
            showProducts={totalProducts.showProducts}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading...</p>
            ) : products.length > 0 ? (
              products.map((product) => {
                // FIX 5: Correctly access the productId from both cart and favorites
                const isInCart = cartItems.some(
                  (item) => item.productId === product._id
                );
                const isFavorite = favoriteItems.some(
                  (item) => item.productId === product._id
                );
                return (
                  <UserProductCard
                    key={product._id}
                    product={product}
                    isInCartInitial={isInCart}
                    isFavoriteInitial={isFavorite}
                  />
                );
              })
            ) : (
              <p>No products found with the selected filters.</p>
            )}
          </div>
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={(page) => updateURL({ page: page })}
          />
        </div>
      </div>
    </div>
  );
}
