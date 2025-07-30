import IndividualReviews from "./IndividualReviews";
import LoadMore from "./LoadeMore";
import ReviewHeader from "./ReviewHeader";
import ReviewSummary from "./ReviewSummary";
export default function Reviews() {
  return (
    <div className="mt-16">
      <ReviewHeader />
      <ReviewSummary />
      <IndividualReviews />
      <LoadMore />
    </div>
  );
}
