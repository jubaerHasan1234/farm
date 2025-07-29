import Image from "next/image";

export default function IndividualReviews() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <Image
            src="https://ix-marketing.imgix.net/focalpoint.png?auto=format,compress&w=1446"
            alt="Sarah"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Sarah Johnson
                </h4>
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400 text-sm">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    2 days ago
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Absolutely amazing tomatoes! The taste is incredible - so fresh
              and flavorful. You can really tell the difference when they're
              picked ripe and delivered quickly. Will definitely order again!
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <button className="hover:text-primary-600 dark:hover:text-primary-400">
                <i className="far fa-thumbs-up mr-1"></i>Helpful (12)
              </button>
              <button className="hover:text-primary-600 dark:hover:text-primary-400">
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <Image
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
            alt="Mike"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Mike Chen
                </h4>
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400 text-sm">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="far fa-star"></i>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    1 week ago
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Great quality tomatoes, very fresh and organic as advertised.
              Delivery was on time. Only minor issue was that a couple of
              tomatoes were slightly overripe, but overall very satisfied.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <button className="hover:text-primary-600 dark:hover:text-primary-400">
                <i className="far fa-thumbs-up mr-1"></i>Helpful (8)
              </button>
              <button className="hover:text-primary-600 dark:hover:text-primary-400">
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <Image
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
            alt="Lisa"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Lisa Rahman
                </h4>
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400 text-sm">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    2 weeks ago
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              These tomatoes are absolutely perfect for salads and cooking. The
              color is vibrant and they taste like they were just picked from
              the garden. Highly recommend!
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <button className="hover:text-primary-600 dark:hover:text-primary-400">
                <i className="far fa-thumbs-up mr-1"></i>Helpful (15)
              </button>
              <button className="hover:text-primary-600 dark:hover:text-primary-400">
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
