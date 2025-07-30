const Count = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
      <div className="text-center">
        <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          500+
        </div>
        <div className="text-gray-600 dark:text-gray-400">Active Farmers</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          50+
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          Districts Covered
        </div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          2000+
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          Products Available
        </div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          95%
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          Organic Certified
        </div>
      </div>
    </div>
  );
};

export default Count;
