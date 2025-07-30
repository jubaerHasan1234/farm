import RelatedProductCart from "./RelatedProductCart";

export default function RelatedProducts() {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <RelatedProductCart key={index} />
        ))}
      </div>{" "}
    </div>
  );
}
