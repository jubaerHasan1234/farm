// components/EditOrderModal.js
import { ClipLoader } from "react-spinners";

const EditOrderModal = ({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleUpdate,
  loading,
  orderItems, // Pass order items to the modal for quantity editing
  formatPrice,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto hide-scrollbar h-screen w-screen">
      <div className="relative p-6 w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Edit Order Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <span className="sr-only">Close modal</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="py-4 space-y-4">
          {/* Editable Fields */}

          <div>
            <label
              htmlFor="addressLine"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Delivery Address
            </label>
            <input
              type="text"
              id="addressLine"
              name="addressLine"
              value={formData.shippingAddress.addressLine}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.shippingAddress.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Quantity editing for each item */}
          <div className="space-y-3 mt-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Item Quantities
            </h4>
            {orderItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <span className="flex-1 text-sm text-gray-900 dark:text-white">
                  {item.product?.productName || "Product"}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Quantity:
                  </span>
                  <input
                    type="number"
                    name="quantity"
                    min={1}
                    value={formData.items[index]?.quantity || 1}
                    onChange={(e) => handleChange(e, index)}
                    className="w-16 px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatPrice(
                      formData.items[index]?.quantity * item.product?.price || 0
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;
