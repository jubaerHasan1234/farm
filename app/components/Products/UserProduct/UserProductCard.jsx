import Image from "next/image";
import { AddToCart, Favorite } from "./index";

const UserProductCard = ({ product }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <Image
          src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop"
          alt="product image"
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Favorite productId={product?.id} isFavorite={product?.isFavorite} />
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {product?.name}
          </h3>
          <div className="flex items-center text-yellow-400">
            <i className="fas fa-star text-sm" />
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              {product?.rating}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          By {product?.farmer} • {product?.location}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {product?.price}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              /kg
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Stock: {product?.stock}kg
          </span>
        </div>
        <AddToCart product={product} />
      </div>
    </div>
  );
};

export default UserProductCard;
