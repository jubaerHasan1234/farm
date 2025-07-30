const EmailNotification = () => {
  return (
    <div className="mt-8 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
      <div className="flex items-center">
        <i className="fas fa-envelope text-blue-600 dark:text-blue-400 mr-3"></i>
        <div>
          <p className="font-medium text-blue-900 dark:text-blue-100">
            Email Confirmation Sent
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            We've sent your order confirmation and receipt to your email
            address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailNotification;
