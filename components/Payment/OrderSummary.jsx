"use client";

import { useState } from 'react';
import Image from "next/image";

const OrderSummary = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!order || !order.items) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No order details available
        </div>
      </div>
    );
  }

  // Calculate order totals
  const totalItems = order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const subtotal = order.items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    const quantity = item.quantity || 0;
    return sum + (price * quantity);
  }, 0);
  
  const tax = subtotal * 0.1; // 10% tax
  const shipping = order.shippingCost || 0;
  const total = subtotal + tax + shipping;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div 
        className="flex justify-between items-center cursor-pointer mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Order Summary {!isExpanded && `(${totalItems} ${totalItems === 1 ? 'item' : 'items'})`}
        </h2>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Order Items */}
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {item.product?.images?.[0] && (
                  <div className="flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.productName || 'Product'}
                      width={80}
                      height={80}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {item.product?.productName || 'Unnamed Product'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Qty: {item.quantity} × {formatPrice(item.product?.price || 0)}
                  </p>
                </div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatPrice((item.product?.price || 0) * (item.quantity || 1))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Shipping</span>
              <span className="font-medium">{shipping > 0 ? formatPrice(shipping) : 'Free'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tax</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
