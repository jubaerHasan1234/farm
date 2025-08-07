"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Pagination from "../../common/Pagination";
import HomeProductHeader from "./HomeProductHeader";
import UserProductCard from "./UserProductCard";

export default function AllProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = parseInt(searchParams.get("page") || "1");
  const [page, setPage] = useState(initialPage);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productRes, cartRes, favRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/best-sellers?page=${page}`,
            {
              cache: "no-store",
            }
          ),
          fetch("/api/cart"),
          fetch("/api/favorites"),
        ]);

        const [productData, cartData, favoriteData] = await Promise.all([
          productRes.json(),
          cartRes.json(),
          favRes.json(),
        ]);

        setProducts(productData.bestSellers || []);
        setTotalPages(productData.totalPages || 1);
        setCartItems(cartData.cart || []);
        setFavoriteItems(favoriteData.favorites || []);
      } catch (error) {
        console.error("❌ Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    router.push(`?page=${newPage}`, { scroll: false });
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeProductHeader />

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <ClipLoader size={40} color="#10B981" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => {
                const isInCart = cartItems.some(
                  (item) => item.productId === product._id
                );

                const isFavorite = favoriteItems.some(
                  (fav) => fav.productId === product._id
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
              <p className="col-span-full text-center text-gray-500">
                No products found.
              </p>
            )}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
}
