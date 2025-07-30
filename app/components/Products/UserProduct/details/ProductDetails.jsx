import Reviews from "../../Rivews/Reviews";
import ProductDescriptionAndReviewsAndFarmerInfo from "./ProductDescriptionAndReviewsAndFarmerInfo";
import ProductDetailsImage from "./ProductDetailsImage";
import RelatedProducts from "./RelatedProducts/RelatedProducts";

export default function ProductDetails() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Product Description */}
      <ProductDetailsImage />
      {/* Product Description and Reviews and Farmer Info */}
      <ProductDescriptionAndReviewsAndFarmerInfo />
      {/* reviews */}
      <Reviews />
      {/* Related Products */}
      <RelatedProducts />
    </div>
  );
}
