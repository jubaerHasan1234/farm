import {
  FiltersSidebar,
  Pagination,
  SortAndViewsOption,
  UserProductCard,
} from "./index";
export default function FiltersAndProduct() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <FiltersSidebar />
        <div className="lg:col-span-3">
          <SortAndViewsOption />
          {/* all product start */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <UserProductCard key={index} />
            ))}
          </div>
          {/* all product end */}
          <Pagination />
        </div>
      </div>
    </div>
  );
}
