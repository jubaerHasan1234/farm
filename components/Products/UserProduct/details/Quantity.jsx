"use client";

export default function Quantity({ quantity, setQuantity, stock }) {
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity !== stock) setQuantity(quantity + 1);
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quantity (kg)
        </label>
        <div className="flex items-center space-x-3">
          <button
            onClick={decreaseQuantity}
            className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <i className="fas fa-minus text-sm"></i>
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-20 h-10 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-900 dark:text-white bg-white dark:bg-gray-800"
          />
          <button
            onClick={increaseQuantity}
            className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <i className="fas fa-plus text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
