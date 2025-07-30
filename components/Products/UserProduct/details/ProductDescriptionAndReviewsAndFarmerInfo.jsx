import Header from "./Header";
import ProductDescription from "./ProductDescription";

export default function ProductDescriptionAndReviewsAndFarmerInfo() {
  return (
    <div className="mt-16">
      <div>
        {" "}
        <Header />
      </div>

      <ProductDescription />
    </div>
  );
}
