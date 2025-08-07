import ProductDescriptionAndReviewsAndFarmerInfo from "./ProductDescriptionAndReviewsAndFarmerInfo";
import ProductDetailsImage from "./ProductDetailsImage";
import RelatedProducts from "./RelatedProducts/RelatedProducts";

export default function ProductDetails({ product, user }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Product Description */}
      <ProductDetailsImage product={product} user={user} />
      {/* Product Description and Reviews and Farmer Info */}
      <ProductDescriptionAndReviewsAndFarmerInfo
        product={product}
        user={user}
      />

      {/* Related Products */}
      <RelatedProducts
        currentProductId={product?._id}
        currentProductFeatures={product?.features}
      />
    </div>
  );
}
