export default function ReviewSummary() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              4.8
            </span>
            <div>
              <div className="flex text-yellow-400 mb-1">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Based on 127 reviews
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm w-8">5★</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
              95
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm w-8">4★</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: "20%" }}
              ></div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
              25
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm w-8">3★</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: "4%" }}
              ></div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
              5
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm w-8">2★</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: "1%" }}
              ></div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
              1
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm w-8">1★</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: "1%" }}
              ></div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
              1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
