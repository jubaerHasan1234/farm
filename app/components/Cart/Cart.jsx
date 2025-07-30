import Image from "next/image";

const Cart = () => {
  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 dark:text-white">
      {/* Cart Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6 flex items-center justify-between">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-primary-500 rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="text-lg">Select All (1 Item)</span>
        </label>
        <div className="text-lg font-semibold">
          JUBAER, your total:{" "}
          <span className="line-through text-red-500">520 Tk.</span>{" "}
          <span className="text-green-500">465 Tk.</span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {/* Product 1 */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-primary-500 rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </label>
          <div className="flex-shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop"
              alt="Product Image"
              width={100}
              height={100}
              className="rounded-md"
            />
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400">
              ইতিহাসের ছিন্নপত্র ১ম, ২য় ও ৩য় খণ্ডের কালেকশন
            </h3>
            <p className="text-gray-600 dark:text-gray-400">কায় কাউস</p>
            <div className="flex items-center space-x-4 mt-2">
              <button className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400">
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
              <button className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md">
                -
              </button>
              <span className="px-4 py-1 border-l border-r border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white">
                1
              </span>
              <button className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md">
                +
              </button>
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              2,620 Tk.
            </div>
          </div>
        </div>
      </div>

      {/* Order Button */}
      <div className="mt-6 flex justify-end">
        <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out dark:bg-primary-700 dark:hover:bg-primary-800">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
