"use client";
import { useState } from "react";
import Reviews from "../../Rivews/Reviews";
import FarmerInfo from "./FarmenInfo";
import Header from "./Header";
import ProductDescription from "./ProductDescription";

export default function ProductDescriptionAndReviewsAndFarmerInfo({
  product,
  user,
}) {
  const [activeTab, setActiveTab] = useState("description");

  const renderContent = () => {
    switch (activeTab) {
      case "reviews":
        return <Reviews product={product} user={user} />;
      case "farmerInfo":
        return <FarmerInfo product={product} user={user} />;
      case "description":
      default:
        return <ProductDescription product={product} />;
    }
  };

  return (
    <div className="mt-16">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reviewCount={product.reviews?.length || 0}
      />
      {renderContent()}
    </div>
  );
}
