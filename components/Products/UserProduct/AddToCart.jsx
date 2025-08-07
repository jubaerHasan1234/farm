"use client";

import { useGlobal } from "@/components/context/GlobalProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
const AddToCart = ({ product, isInCartInitial = false }) => {
  const [loading, setLoading] = useState(false);
  const [isInCart, setIsInCart] = useState(isInCartInitial);
  const { updateCartCount } = useGlobal();
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = async () => {
    if (!session) return router.push("/login");
    try {
      setLoading(true);

      const res = await fetch(`/api/cart`, {
        method: isInCart ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          ...(isInCart
            ? {}
            : {
                productName: product.productName,
                image: product.images?.[0] || "",
                unit: product.unit,
                price: product.price,
                stock: product.stock,
                quantity: 1,
              }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setIsInCart(!isInCart);

      // ✅ Update global cart count
      const resCart = await fetch("/api/cart");
      if (resCart.ok) {
        const cartData = await resCart.json();

        updateCartCount(cartData?.cart?.length);
      }
    } catch (error) {
      console.error(
        isInCart ? "Error removing from cart" : "Error adding to cart",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`w-full py-2 rounded-lg font-medium transition ${
        loading
          ? "bg-primary-700 cursor-not-allowed"
          : isInCart
          ? "bg-red-500 hover:bg-red-600"
          : "bg-primary-600 hover:bg-primary-700"
      }`}
      onClick={handleClick}
      disabled={loading || product?.stock === 0}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          {isInCart ? "Removing..." : "Adding..."}
        </div>
      ) : isInCart ? (
        "Remove from Cart"
      ) : (
        "Add to Cart"
      )}
    </button>
  );
};

export default AddToCart;
