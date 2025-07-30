const PaymentDetails = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Payment Summary
      </h2>

      {/* Payment Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
          <span className="text-gray-900 dark:text-white">৳225</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Delivery Fee:
          </span>
          <span className="text-gray-900 dark:text-white">৳50</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Service Fee:</span>
          <span className="text-gray-900 dark:text-white">৳25</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
            <span>Total Paid:</span>
            <span>৳300</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Payment Method
        </h3>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <i className="fas fa-credit-card text-lg text-gray-600 dark:text-gray-400"></i>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Visa ending in 1234
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Paid on Dec 20, 2024
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
              TXN-FB-20241220-001234
            </p>
          </div>
          <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            <i className="fas fa-copy"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
