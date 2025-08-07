export default function LoadMore({ onClick, loading }) {
  return (
    <div className="text-center mt-8">
      <button
        onClick={onClick}
        disabled={loading}
        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Loading..." : "Load More Reviews"}
      </button>
    </div>
  );
}
