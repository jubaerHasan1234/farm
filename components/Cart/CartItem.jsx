import Image from "next/image";

const formatPrice = (price) => `৳${price.toFixed(2)}`;
const CartItem = ({
  item,
  isSelected,
  onSelect,
  onQuantityChange,
  onDelete,
}) => {
  // Access properties directly from the item object
  const { productId, productName, image, price, quantity, unit } = item;
  const itemTotal = (price || 0) * (quantity || 0);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex items-center space-x-4">
      <label className="flex items-center">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-primary-500 rounded dark:bg-gray-700 dark:border-gray-600"
          checked={isSelected}
          onChange={(e) => onSelect(productId, e.target.checked)}
        />
      </label>
      <div className="flex-shrink-0">
        <Image
          src={
            image || "https://placehold.co/100x100/e0e0e0/000000?text=No+Image"
          }
          alt={productName || "Product Image"}
          width={100}
          height={100}
          className="rounded-md object-cover w-[100px] h-[100px]"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400">
          {productName || "Unnamed Product"}
        </h3>
        {/* Assuming 'author' is not directly in your provided API response,
              I'm removing it or you can replace with another relevant field like 'unit' or 'productId' if desired */}
        <p className="text-gray-600 dark:text-gray-400">
          Unit: {unit || "N/A"}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Price: {price || "N/A"}
        </p>
        <div className="flex items-center space-x-4 mt-2">
          <button
            onClick={() => onDelete(productId)}
            className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 flex items-center"
          >
            <i className="fas fa-trash mr-1"></i> Delete
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
          <button
            onClick={() => onQuantityChange(productId, quantity - 1)}
            className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md"
          >
            -
          </button>
          <span className="px-4 py-1 border-l border-r border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white">
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(productId, quantity + 1)}
            className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md"
          >
            +
          </button>
        </div>
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          {formatPrice(itemTotal)}
        </div>
      </div>
    </div>
  );
};
export default CartItem;
