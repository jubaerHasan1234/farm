export default function ReviewSummary({ reviews }) {
  // Logic to calculate average rating and star counts
  const reviewCount = reviews?.length || 0;
  const totalRating =
    reviews?.reduce((sum, review) => sum + review.rating, 0) || 0;
  const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

  const getStarCount = (rating) => {
    return (
      reviews?.filter((review) => Math.floor(review.rating) === rating)
        .length || 0
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {averageRating.toFixed(1)}
            </span>
            <div>
              <div className="flex text-yellow-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={
                      averageRating >= i + 1 ? "fas fa-star" : "far fa-star"
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Based on {reviewCount} reviews
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = getStarCount(rating);
            const percentage =
              reviewCount > 0 ? (count / reviewCount) * 100 : 0;
            return (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
