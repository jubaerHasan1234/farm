import Count from "./Count";
import FarmersCard from "./FarmersCard";
import LoadMore from "./LoadMore";

export default function FarmersGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* count farmers */}
      <Count />
      {/* all farmers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <FarmersCard key={index} />
        ))}
      </div>
      {/* load more */}
      <LoadMore />
    </div>
  );
}
