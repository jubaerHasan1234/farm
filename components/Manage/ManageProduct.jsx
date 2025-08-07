"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ClipLoader } from "react-spinners";
import { Pagination } from "../Products/UserProduct";
import NoProduct from "../common/NoProduct";
import ManageHeader from "./ManageHeader";
import ManageProductAll from "./ManageProductAll";
import ManageSearchAndFilter from "./ManageSearchAndFilter";
export default function ManageProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  // Extract values from URL
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Fetch products when query changes
  useEffect(() => {
    const fetchProducts = async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search ? { search } : {}),
        ...(category ? { category } : {}),
        ...(status ? { status } : {}),
      });

      setLoading(true);
      try {
        const res = await fetch(`/api/manage-products?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
          setTotalPages(data.pagination.totalPages);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, status, page]);

  // Update URL (triggered from children)
  const updateUrl = (changes = {}) => {
    const nextSearch = changes.search ?? search;
    const nextCategory = changes.category ?? category;
    const nextStatus = changes.status ?? status;
    const nextPage = changes.page ?? 1;

    const query = new URLSearchParams();

    if (nextSearch) query.set("search", nextSearch);
    if (nextCategory) query.set("category", nextCategory);
    if (nextStatus) query.set("status", nextStatus);
    query.set("page", nextPage.toString());

    router.push(`?${query.toString()}`, { scroll: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ManageHeader />
      <ManageSearchAndFilter
        search={search}
        category={category}
        status={status}
        onFilterChange={updateUrl}
      />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader speedMultiplier={0.5} size={50} color="#4fa94d" />
        </div>
      ) : products.length === 0 ? (
        <NoProduct
          message="No products found"
          showButton={true}
          buttonText="Add New Product"
          buttonHref="/create"
        />
      ) : (
        <>
          <ManageProductAll
            products={products}
            setProducts={setProducts}
            loading={loading}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => updateUrl({ page: p })}
          />
        </>
      )}
    </div>
  );
}
