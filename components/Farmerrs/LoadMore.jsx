export default function LoadMore({ onClick, loading }) {
  return (
    <div className="text-center mt-12">
      <button
        onClick={onClick}
        disabled={loading}
        className={`bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition disabled:bg-gray-400 disabled:cursor-not-allowed`}
      >
        {loading ? "Loading..." : "Load More Farmers"}
      </button>
    </div>
  );
}
