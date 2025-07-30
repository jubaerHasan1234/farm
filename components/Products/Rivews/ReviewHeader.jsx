export default function ReviewHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Customer Reviews
      </h2>
      <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition">
        Write a Review
      </button>
    </div>
  );
}
