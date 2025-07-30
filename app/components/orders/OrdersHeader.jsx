const OrdersHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Orders
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track and manage your orders
        </p>
      </div>
      <div className="mt-4 sm:mt-0 flex space-x-3">
        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-10">
          <option>All Orders</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </div>
    </div>
  );
};

export default OrdersHeader;
