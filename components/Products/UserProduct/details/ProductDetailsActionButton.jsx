"use client";

import { useGlobal } from "@/components/context/GlobalProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

export default function ProductDetailsActionButton({ product, quantity }) {
  const router = useRouter();
  const { updateCartCount, updateFavoriteCount } = useGlobal();

  const [loadingAction, setLoadingAction] = useState(null); // "buy" | "cart" | "favorite"
  const [inCart, setInCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { data: session } = useSession();

  // On mount, fetch cart and favorite list, check if product is present
  useEffect(() => {
    async function fetchUserLists() {
      try {
        // ✅ Fetch cart
        const cartRes = await fetch("/api/cart");
        if (cartRes.ok) {
          const { cart } = await cartRes.json(); // ← IMPORTANT
          const existsInCart = cart?.some(
            (item) => String(item.productId) === String(product._id)
          );
          setInCart(existsInCart);
        }

        // ✅ Fetch favorites
        const favRes = await fetch("/api/favorites");
        if (favRes.ok) {
          const { favorites } = await favRes.json(); // ← Adjusted for correct structure
          const existsInFav = favorites?.some(
            (item) => String(item.productId) === String(product._id)
          );
          setIsFavorite(existsInFav);
        }
      } catch (error) {
        console.error("❌ Failed to fetch cart or favorites:", error);
      }
    }

    fetchUserLists();
  }, [product._id]);

  // Buy Now handler
  const handleBuyNow = async () => {
    if (!session) return router.push("/login");
    setLoadingAction("buy");

    try {
      // 1. Place the order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              product: product._id,
              quantity: quantity,
              price: product.price,
              unit: product.unit,
              productName: product.productName,
              image: product.images?.[0] || "",
            },
          ],
          totalAmount: product.price * quantity,
          shippingCost: 50,
          serviceFee: 50,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Order failed");
      }

      const data = await res.json();
      const orderId = data?.order?._id; // adjust this based on your API response key

      // Remove product from cart if it was there
      if (inCart) {
        try {
          const deleteRes = await fetch("/api/cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product._id }),
          });

          if (!deleteRes.ok) {
            const deleteData = await deleteRes.json();
            console.error(
              "❌ Failed to remove item from cart after order:",
              deleteData.message
            );
            // Optionally, show a non-blocking message to the user that cart update failed
          } else {
            // Update UI state for cart
            setInCart(false);
            updateCartCount((prev) => prev - 1);
          }
        } catch (deleteError) {
          console.error(
            "❌ Error during cart removal after order:",
            deleteError
          );
        }
      }

      // 2. Navigate to payment page
      router.push(`/payment/${orderId}`);
    } catch (error) {
      console.error("❌ Order failed: " + error.message);
      // You might want to show a user-friendly error message here
    } finally {
      setLoadingAction(null);
    }
  };

  // Toggle Add / Remove Cart
  const handleToggleCart = async () => {
    if (!session) return router.push("/login");
    setLoadingAction("cart");
    try {
      if (inCart) {
        // Remove from cart
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product._id }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Remove from cart failed");
        }

        setInCart(false);
        updateCartCount((prev) => prev - 1);
      } else {
        // Add to cart
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product._id,
            productName: product.productName,
            image: product.images?.[0] || "",
            unit: product.unit,
            price: product.price,
            stock: product.stock,
            quantity: 1,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Add to cart failed");
        }

        setInCart(true);
        updateCartCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("❌ Cart action failed: " + error.message);
    } finally {
      setLoadingAction(null);
    }
  };

  // Toggle Add / Remove Favorite
  const handleToggleFavorite = async () => {
    if (!session) return router.push("/login");
    setLoadingAction("favorite");
    try {
      if (isFavorite) {
        // Remove from favorites
        const res = await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product._id }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Remove from favorites failed");
        }

        setIsFavorite(false);
        updateFavoriteCount((prev) => prev - 1);
      } else {
        // Add to favorites
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product._id,
            productName: product.productName,
            image: product.images?.[0] || "",
            unit: product.unit,
            price: product.price,
            stock: product.stock,
            reviews: product.reviews ?? 0,
            rating: product.rating ?? 0,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Add to favorites failed");
        }

        setIsFavorite(true);
        updateFavoriteCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("❌ Favorite action failed: " + error.message);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-3">
      <button
        className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        onClick={handleBuyNow}
        disabled={loadingAction !== null || product?.stock === 0}
      >
        {loadingAction === "buy" ? (
          <div className="flex justify-center">
            <ClipLoader speedMultiplier={0.5} size={24} color="#fff" />
          </div>
        ) : (
          <>
            <i className="fas fa-bolt mr-2"></i>
            Buy Now
          </>
        )}
      </button>

      <button
        className={`w-full ${
          inCart
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
        } py-3 px-6 rounded-lg font-medium transition flex items-center justify-center`}
        onClick={handleToggleCart}
        disabled={loadingAction !== null || product?.stock === 0}
      >
        {loadingAction === "cart" ? (
          <ClipLoader
            speedMultiplier={0.5}
            size={24}
            color={inCart ? "#fff" : "#111"}
          />
        ) : (
          <>
            <i className={`fas fa-shopping-cart mr-2`} />
            {inCart ? "Remove from Cart" : "Add to Cart"}
          </>
        )}
      </button>

      <button
        className={`w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-medium transition flex items-center justify-center ${
          isFavorite ? "text-red-500" : ""
        }`}
        onClick={handleToggleFavorite}
        disabled={loadingAction !== null}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {loadingAction === "favorite" ? (
          <ClipLoader speedMultiplier={0.5} size={24} color="#e11d48" />
        ) : (
          <>
            <i
              className={isFavorite ? "fas fa-heart mr-2" : "far fa-heart mr-2"}
            />
            {isFavorite ? "Remove from Favorite" : "Add to Favorite"}
          </>
        )}
      </button>
    </div>
  );
}
