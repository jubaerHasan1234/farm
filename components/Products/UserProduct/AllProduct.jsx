import { HomeProductHeader, UserProductCard } from "./index";

export default function AllProduct() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeProductHeader />
        {/* all product start */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <UserProductCard key={index} />
          ))}
        </div>
        {/* all product end */}
      </div>
    </section>
  );
}
