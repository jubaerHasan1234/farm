export function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) {
    return null;
  }
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return parseFloat((totalRating / reviews.length).toFixed(1));
}
