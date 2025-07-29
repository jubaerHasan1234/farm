"use client";
import { useState } from "react";

export default function ProductImage() {
  const [mainImage, setMainImage] = useState(
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=600&fit=crop"
  );

  const thumbnails = [
    {
      src: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=1000&h=1000&fit=crop",
      alt: "Tomatoes 1",
    },
    {
      src: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=10000&h=10000&fit=crop",
      alt: "Tomatoes 2",
    },
    {
      src: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=1000&h=1000&fit=crop",
      alt: "Tomatoes 3",
    },
    {
      src: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=1000&h=1000&fit=crop",
      alt: "Tomatoes 4",
    },
    {
      src: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=1000&h=1000&fit=crop",
      alt: "Tomatoes 5",
    },
  ];

  const handleThumbnailClick = (src) => {
    setMainImage(src);
  };
  return (
    <div className="space-y-4">
      <div className="aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={mainImage}
          alt="Fresh Tomatoes"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-5 gap-2">
        {thumbnails.map((thumbnail, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(thumbnail.src)}
            className={`aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 ${
              mainImage === thumbnail.src
                ? "border-primary-500"
                : "border-transparent hover:border-primary-500"
            }`}
          >
            <img
              src={thumbnail.src}
              alt={thumbnail.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
