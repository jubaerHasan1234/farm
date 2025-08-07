import { useGlobal } from "@/components/context/GlobalProvider";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

// Helper function to format price
const formatPrice = (price) => `৳${price.toFixed(2)}`;

// Custom hook for cart state and actions
const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set()); // Stores product IDs of selected items
  const [placingOrder, setPlacingOrder] = useState(false); // New state for order placement loading
  const { updateCartCount } = useGlobal();
  const router = useRouter();
  // Fetch cart data from API
  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Adjust this line to access the 'cart' array from your API response
      const fetchedCart = data.cart || [];
      setCartItems(fetchedCart);
      // Initialize selected items to all items being selected by default
      setSelectedItems(new Set(fetchedCart.map((item) => item.productId)));
    } catch (err) {
      setError("Failed to load cart. Please try again.");
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Handle individual item selection
  const handleSelectItem = useCallback((productId, isChecked) => {
    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (isChecked) {
        newSelected.add(productId);
      } else {
        newSelected.delete(productId);
      }
      return newSelected;
    });
  }, []);

  // Handle "Select All"
  const handleSelectAll = useCallback(
    (isChecked) => {
      if (isChecked) {
        setSelectedItems(new Set(cartItems.map((item) => item.productId)));
      } else {
        setSelectedItems(new Set());
      }
    },
    [cartItems]
  );

  // Update item quantity on the backend
  const updateCartItemQuantity = useCallback(
    async (productId, newQuantity) => {
      if (newQuantity < 1) return; // Prevent quantity from going below 1

      const updatedItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems); // Optimistic update

      try {
        const response = await fetch("/api/cart", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          // Send the updated item's productId and quantity
          body: JSON.stringify({
            productId: productId,
            quantity: newQuantity,
            // You might need to send other fields if your backend requires them
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update quantity on server.");
        }
      } catch (err) {
        setError("Failed to update quantity. Please refresh.");
        console.error("Error updating quantity:", err);
        fetchCart(); // Revert to original state on error
      }
    },
    [cartItems, fetchCart]
  );

  // Internal function to delete multiple items (used after order placement)
  const deleteMultipleCartItems = useCallback(
    async (productIds) => {
      if (!productIds || productIds.length === 0) return;

      // Optimistically remove items from UI
      setCartItems((prevItems) =>
        prevItems.filter((item) => !productIds.includes(item.productId))
      );
      setSelectedItems((prevSelected) => {
        const newSelected = new Set(prevSelected);
        productIds.forEach((id) => newSelected.delete(id));
        return newSelected;
      });

      try {
        const response = await fetch(`/api/cart`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: productIds, // Send array of productIds for batch delete
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete items from cart on server.");
        }

        const result = await response.json();
        if (result.success) {
          // Update global cart count based on deleted items
          updateCartCount((prev) => prev - result.deletedCount);
        }
      } catch (err) {
        console.error("Error deleting multiple items:", err);
        setError("Failed to clear some items from cart. Please refresh.");
        fetchCart(); // Revert to original state on error
      }
    },
    [updateCartCount, fetchCart]
  );

  // Delete item from cart on the backend (single item deletion)
  const deleteCartItem = useCallback(
    async (productId) => {
      // IMPORTANT: Use a custom modal or message box instead of window.confirm in production
      // For Canvas environment, window.confirm is used for simplicity.
      const isConfirmed = window.confirm(
        "Are you sure you want to remove this item from your cart?"
      );
      if (!isConfirmed) return;

      // Call the multiple delete function for a single item
      await deleteMultipleCartItems([productId]);
    },
    [deleteMultipleCartItems]
  );

  // Calculate totals
  const {
    subtotal,
    totalSelectedItemsPrice,
    totalOriginalPriceForSelected,
    totalItemsCount,
    selectedItemsForOrder, // New: items formatted for the order API
  } = useMemo(() => {
    let currentSubtotal = 0;
    let currentTotalSelectedItemsPrice = 0;
    let currentTotalItemsCount = 0;
    const itemsForOrder = []; // To store selected items in the required format

    cartItems.forEach((item) => {
      // Access price and quantity directly from the item
      const itemPrice = item.price || 0;
      const itemQuantity = item.quantity || 0;

      currentSubtotal += itemPrice * itemQuantity;
      currentTotalItemsCount += itemQuantity;

      if (selectedItems.has(item.productId)) {
        currentTotalSelectedItemsPrice += itemPrice * itemQuantity;
        itemsForOrder.push({
          product: item.productId, // Your API expects product._id here
          quantity: itemQuantity,
          price: itemPrice, // Price per unit, not total price for the item
          unit: item.unit,
          productName: item.productName,
          image: item.image,
        });
      }
    });

    // Simulate a discount for display purposes (e.g., 10% off the selected items)
    const originalPriceForSelected = currentTotalSelectedItemsPrice * 1.1; // 10% higher than discounted
    const discountedPriceForSelected = currentTotalSelectedItemsPrice;

    return {
      subtotal: currentSubtotal,
      totalSelectedItemsPrice: discountedPriceForSelected,
      totalOriginalPriceForSelected: originalPriceForSelected,
      totalItemsCount: currentTotalItemsCount,
      selectedItemsForOrder: itemsForOrder,
    };
  }, [cartItems, selectedItems]);

  // Handle placing an order
  const handlePlaceOrder = useCallback(async () => {
    if (selectedItemsForOrder.length === 0) {
      // IMPORTANT: Use a custom modal or message box instead of alert in production
      alert("Please select at least one item to place an order.");
      return;
    }

    setPlacingOrder(true);
    setError(null);

    try {
      const orderPayload = {
        items: selectedItemsForOrder,
        totalAmount: totalSelectedItemsPrice,
        shippingCost: 50, // Fixed as per your requirement
        serviceFee: 50, // Fixed as per your requirement
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order.");
      } else {
        const result = await response.json();
        router.push(`/payment/${result.order._id}`);
        // --- Delete ordered items from cart ---
        const productIdsToDelete = selectedItemsForOrder.map(
          (item) => item.product
        );
        await deleteMultipleCartItems(productIdsToDelete);
      }
    } catch (err) {
      setError(`Order placement failed: ${err.message}`);
      console.error("Error placing order:", err);
    } finally {
      setPlacingOrder(false);
    }
  }, [selectedItemsForOrder, totalSelectedItemsPrice, deleteMultipleCartItems]);

  return {
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
    handlePlaceOrder, // Expose the new function
    placingOrder, // Expose the new loading state
  };
};

export default useCart;
