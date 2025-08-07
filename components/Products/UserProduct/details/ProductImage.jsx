"use client";
import { useState } from "react";

export default function ProductImage({ images = [] }) {
  const [mainImage, setMainImage] = useState(images[0]);

  const handleThumbnailClick = (src) => {
    setMainImage(src);
  };

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={mainImage}
          alt="Product Image"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(img)}
            className={`aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 ${
              mainImage === img
                ? "border-primary-500"
                : "border-transparent hover:border-primary-500"
            }`}
          >
            <img
              src={img}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
