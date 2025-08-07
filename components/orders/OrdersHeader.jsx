"use client"; // This component might be used in a client context

const OrdersHeader = ({ statusFilter, onStatusChange, totalOrders }) => {
  const orderStatuses = [
    { value: "", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My customer Orders
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track and manage your orders ({totalOrders} total)
        </p>
      </div>
      <div className="mt-4 sm:mt-0 flex space-x-3">
        <select
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-10"
          value={statusFilter}
          onChange={onStatusChange}
        >
          {orderStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OrdersHeader;
