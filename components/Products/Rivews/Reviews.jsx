"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import IndividualReviews from "./IndividualReviews";
import LoadMore from "./LoadeMore";
import ReviewHeader from "./ReviewHeader";
import ReviewSummary from "./ReviewSummary";

export default function Reviews({ product, user }) {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { data: session } = useSession();
  // Function to fetch reviews from the API
  const fetchReviews = async (pageToFetch = 0) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/review/${product._id}/review?page=${pageToFetch}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch reviews.");
      }
      const data = await res.json();
      if (pageToFetch === 0) {
        setReviews(data.reviews);
      } else {
        setReviews((prevReviews) => [...prevReviews, ...data.reviews]);
      }

      // Check if there are more reviews to load
      setHasMore(data.reviews.length === 5);
      setPage(pageToFetch);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // Handle error state
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, [product._id]);

  // Handler for loading more reviews
  const handleLoadMore = () => {
    fetchReviews(page + 1);
  };

  // Handlers to update state after a review is edited or deleted
  const handleReviewUpdated = (updatedReview) => {
    setReviews(
      reviews.map((r) => (r._id === updatedReview._id ? updatedReview : r))
    );
  };

  const handleReviewDeleted = (deletedReviewId) => {
    setReviews(reviews.filter((r) => r._id !== deletedReviewId));
  };

  return (
    <div className="mt-16">
      <ReviewHeader
        reviews={reviews}
        productId={product._id}
        session={session}
      />
      <ReviewSummary reviews={reviews} />
      <IndividualReviews
        reviews={reviews}
        loggedInUser={session?.user}
        productId={product._id}
        onReviewUpdated={handleReviewUpdated}
        onReviewDeleted={handleReviewDeleted}
      />
      {hasMore && <LoadMore onClick={handleLoadMore} loading={loading} />}
    </div>
  );
}
