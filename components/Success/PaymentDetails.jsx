const formatPrice = (price) => `৳${Number(price).toFixed(2)}`;

export default function PaymentDetails({ order }) {
  // If order is not provided or is null, render a loading/placeholder state
  if (!order) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">
          Loading payment details...
        </p>
      </div>
    );
  }

  // Calculate Subtotal (Total - Shipping - Service)
  const subtotal = order.totalAmount - order.shippingCost - order.serviceFee;

  // Format payment method string for display (e.g., "sslcommerz" -> "SSLCommerz")
  const formattedPaymentMethod = order.paymentMethod
    ? order.paymentMethod
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "N/A";

  // Format date for display
  const paymentDate = order.updatedAt
    ? new Date(order.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  // Function to copy transaction ID to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Transaction ID copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy Transaction ID.");
      });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Payment Summary
      </h2>

      {/* Payment Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
          <span className="text-gray-900 dark:text-white">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Delivery Fee:
          </span>
          <span className="text-gray-900 dark:text-white">
            {formatPrice(order.shippingCost)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Service Fee:</span>
          <span className="text-gray-900 dark:text-white">
            {formatPrice(order.serviceFee)}
          </span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
            <span>Total Paid:</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Payment Method
        </h3>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {/* Dynamic icon based on payment method */}
          <i
            className={`fas ${
              order.paymentMethod === "card"
                ? "fa-credit-card"
                : order.paymentMethod === "bkash"
                ? "fa-mobile-alt"
                : order.paymentMethod === "nagad"
                ? "fa-wallet"
                : "fa-question-circle" // Default icon for unknown method
            } text-lg text-gray-600 dark:text-gray-400`}
          ></i>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {formattedPaymentMethod}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {order.paymentStatus === "paid"
                ? `Paid on ${paymentDate}`
                : `Status: ${order.paymentStatus}`}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction ID */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transaction ID
            </p>
            <p className="font-mono text-sm text-gray-900 dark:text-white">
              {order._id}
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(order._id)}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            <i className="fas fa-copy"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
