import ManageProductCard from "./ManageProductCard";

export default function ManageProductAll({ products, setProducts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ManageProductCard
          key={product._id}
          product={product}
          setProducts={setProducts}
          products={products}
        />
      ))}
    </div>
  );
}
