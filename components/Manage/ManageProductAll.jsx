import ManageProductCard from "./ManageProductCard";

export default function ManageProductAll() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <ManageProductCard key={index} />
      ))}
    </div>
  );
}
