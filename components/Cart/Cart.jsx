"use client";

import { useCart } from "@/hooks";

import { ClipLoader } from "react-spinners";
import CartItem from "./CartItem";

// Helper function to format price
const formatPrice = (price) => `৳${price.toFixed(2)}`;

// Custom hook for cart state and actions

// CartItem sub-component for better readability

// Main Cart Component
const Cart = () => {
  const {
    cartItems,
    loading,
    error,
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    updateCartItemQuantity,
    deleteCartItem,
    subtotal,
    totalSelectedItemsPrice,
    totalOriginalPriceForSelected,
    totalItemsCount,
    handlePlaceOrder, // Destructure the new function
    placingOrder, // Destructure the new loading state
  } = useCart();

  const isAllSelected =
    cartItems.length > 0 && selectedItems.size === cartItems.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 dark:bg-gray-900">
        <ClipLoader size={50} color="#4A90E2" />
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">
          Loading cart...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 dark:text-red-400 dark:bg-gray-900">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400 dark:bg-gray-900">
        <p className="text-2xl font-semibold mb-4">Your cart is empty!</p>
        <p>Start shopping to add items to your cart.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 dark:text-white">
      {/* Cart Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6 flex items-center justify-between">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-primary-500 rounded dark:bg-gray-700 dark:border-gray-600"
            checked={isAllSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <span className="text-lg">
            Select All ({totalItemsCount}{" "}
            {totalItemsCount === 1 ? "Item" : "Items"})
          </span>
        </label>
        <div className="text-lg font-semibold">
          JUBAER, your total:{" "}
          <span className="line-through text-red-500">
            {formatPrice(totalOriginalPriceForSelected)}
          </span>{" "}
          <span className="text-green-500">
            {formatPrice(totalSelectedItemsPrice)}
          </span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {cartItems.map((item) => (
          <CartItem
            key={item.productId} // Use productId as key
            item={item}
            isSelected={selectedItems.has(item.productId)}
            onSelect={handleSelectItem}
            onQuantityChange={updateCartItemQuantity}
            onDelete={deleteCartItem}
          />
        ))}
      </div>

      {/* Order Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handlePlaceOrder} // Call the new function
          disabled={placingOrder || totalSelectedItemsPrice <= 0} // Disable if placing order or no items selected
          className={`bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out dark:bg-primary-700 dark:hover:bg-primary-800
            ${
              placingOrder || totalSelectedItemsPrice <= 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
        >
          {placingOrder ? (
            <ClipLoader size={20} color="#fff" />
          ) : (
            `Place Order (${formatPrice(totalSelectedItemsPrice)})`
          )}
        </button>
      </div>
    </div>
  );
};

export default Cart;
