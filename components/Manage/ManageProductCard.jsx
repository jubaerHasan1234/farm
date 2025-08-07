// "use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ActiveAndInactive from "./ActiveAndInactive";
import Delete from "./Delete";
const ManageProductCard = ({ product, setProducts, products }) => {
  const {
    productName,
    category,
    price,
    unit,
    stock,
    images,
    features,
    productStatus,
    activeStatus,
    rating,
    reviews,
  } = product;
  const router = useRouter();

  // Safe fallback image
  const imageUrl =
    images?.[0]?.startsWith("http") || images?.[0]?.startsWith("/")
      ? images[0]
      : "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=200&fit=crop";

  // Status label
  const statusColor = activeStatus ? "bg-green-500" : "bg-gray-400";
  const statusLabel = activeStatus ? "Active" : "Inactive";

  // Stock badge and stock text color
  let stockBadge = null;
  let stockTextColor = "text-gray-500 dark:text-gray-400";

  if (stock === 0) {
    stockBadge = (
      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium ml-2">
        Out of Stock
      </span>
    );
    stockTextColor = "text-red-600";
  } else if (stock <= 5) {
    stockBadge = (
      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium ml-2">
        Low Stock
      </span>
    );
    stockTextColor = "text-yellow-500";
  }
  function handleEdit() {
    router.push(`/manage/edit/${product._id}`);
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="relative">
        <Image
          src={imageUrl}
          alt={productName || "Product Image"}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 space-y-1">
          <span
            className={`${statusColor} text-white px-2 py-1 rounded-full text-xs font-medium`}
          >
            {statusLabel}
          </span>
          {stockBadge}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {productName}
          </h3>
          <div className="flex items-center text-yellow-400">
            <i className="fas fa-star text-sm"></i>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              {rating} ({reviews?.length})
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 capitalize">
          {features?.join(" • ")} • {category}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ৳{price}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              /{unit}
            </span>
          </div>
          <span className={`text-sm ${stockTextColor}`}>
            Stock: {stock}
            {unit}
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition text-sm"
          >
            <i className="fas fa-edit mr-1"></i>Edit
          </button>
          <ActiveAndInactive
            product={product}
            setProducts={setProducts}
            products={products}
          />
          <Delete
            product={product}
            setProducts={setProducts}
            products={products}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageProductCard;
