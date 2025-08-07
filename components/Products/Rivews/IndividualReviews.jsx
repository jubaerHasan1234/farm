import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function IndividualReviews({
  reviews,
  loggedInUser,
  productId,
  onReviewUpdated,
  onReviewDeleted,
}) {
  const { data: session } = useSession();
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getElapsedTime = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInSeconds = Math.floor((now - created) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setEditedComment(review.comment);
    setEditedRating(review.rating);
  };

  const handleSaveEdit = async (reviewId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/review/${productId}/review/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: editedComment, rating: editedRating }),
      });
      if (!res.ok) throw new Error("Failed to update review.");
      const updatedReviewData = await res.json();
      onReviewUpdated(updatedReviewData.review);
      setEditingReviewId(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save your review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/review/${productId}/review/${reviewId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete review.");
      onReviewDeleted(reviewId);
    } catch (err) {
      console.error(err);
      setError("Failed to delete your review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
  };

  const isOwner = (review) =>
    session?.user && String(review.user) === String(session?.user?.id);

  return (
    <div className="space-y-6">
      {error && <div className="text-red-500 text-center">{error}</div>}
      {loading && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Processing...
        </div>
      )}
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6"
          >
            <div className="flex items-start space-x-4">
              <Image
                src={
                  review?.userImage ||
                  "https://placehold.co/80x80/e0e0e0/000000?text=User"
                }
                alt={review?.userName}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {review.userName}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={
                              review.rating >= i + 1
                                ? "fas fa-star"
                                : "far fa-star"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getElapsedTime(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  {isOwner(review) && editingReviewId !== review._id && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditClick(review)}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                {editingReviewId === review._id ? (
                  <div className="mt-4">
                    <div className="flex space-x-1 text-yellow-400 text-lg mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`cursor-pointer ${
                            editedRating >= star ? "fas fa-star" : "far fa-star"
                          }`}
                          onClick={() => setEditedRating(star)}
                        ></i>
                      ))}
                    </div>
                    <textarea
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                      className="w-full h-24 p-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-700"
                      placeholder="Edit your review..."
                    />
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleSaveEdit(review._id)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No reviews yet. Be the first to review!
        </p>
      )}
    </div>
  );
}
