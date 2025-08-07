"use client";
import { Heart, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
// Assuming a global context provider exists
import { useGlobal } from "../context/GlobalProvider";
import FavouriteProductCard from "./FavouriteProductCard";

const Favourite = () => {
  // State to hold the fetched favorite products
  const [favorites, setFavorites] = useState([]);
  // State to hold cart product IDs
  const [cartItems, setCartItems] = useState([]);

  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  const [isCartLoading, setIsCartLoading] = useState(true);

  // State for any errors during fetching
  const [error, setError] = useState(null);
  const [cartError, setCartError] = useState(null);

  // State to track which product is being removed from favorites or added/removed from cart
  const [removingProductId, setRemovingProductId] = useState(null);
  const [processingCartProductId, setProcessingCartProductId] = useState(null);

  // Assuming a useGlobal hook exists to get context values
  const { updateFavoriteCount, updateCartCount } = useGlobal();

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/favorites");

        if (!response.ok) {
          throw new Error(`Failed to fetch favourites: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && Array.isArray(data.favorites)) {
          setFavorites(data.favorites);
        } else {
          setFavorites([]);
          console.warn(
            "API response for favourites was not an array. Assuming empty list."
          );
        }
      } catch (err) {
        console.error("Error fetching favourites:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCartItems = async () => {
      try {
        setIsCartLoading(true);
        const response = await fetch("/api/cart");

        if (!response.ok) {
          throw new Error(`Failed to fetch cart items: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && Array.isArray(data.cart)) {
          setCartItems(data.cart.map((item) => item.productId));
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setCartError(err.message);
      } finally {
        setIsCartLoading(false);
      }
    };

    fetchFavourites();
    fetchCartItems();
  }, []); // The empty dependency array ensures this runs only once on mount

  // Function for removing a favourite from the favorites list
  const handleRemoveFavorite = async (productId) => {
    setRemovingProductId(productId);
    try {
      const response = await fetch("/api/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: productId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete favourite: ${response.statusText}`);
      }

      // FIX: Filter based on the productId, not the favorite document's _id
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.productId !== productId)
      );
      updateFavoriteCount((prev) => prev - 1);
    } catch (err) {
      console.error("Error removing favourite:", err);
      setError("Failed to remove product. Please try again.");
    } finally {
      setRemovingProductId(null);
    }
  };

  // Function for adding an item to the cart
  const handleAddToCart = async (product) => {
    setProcessingCartProductId(product.productId);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.productId,
          productName: product.productName,
          image: product.image,
          unit: product.unit,
          price: product.price,
          stock: 1, // Assuming default stock for cart item
          quantity: 1, // Assuming default quantity
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add to cart: ${response.statusText}`);
      }

      // Add the product ID to the cartItems state
      setCartItems((prevCartItems) => [...prevCartItems, product.productId]);
      updateCartCount((prev) => prev + 1);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setCartError("Failed to add product to cart. Please try again.");
    } finally {
      setProcessingCartProductId(null);
    }
  };

  // Function for removing an item from the cart
  const handleRemoveFromCart = async (productId) => {
    setProcessingCartProductId(productId);

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to remove from cart: ${response.statusText}`);
      }

      // Filter out the product ID from the cartItems state
      setCartItems((prevCartItems) =>
        prevCartItems.filter((id) => id !== productId)
      );
      updateCartCount((prev) => prev - 1);
    } catch (err) {
      console.error("Error removing from cart:", err);
      setCartError("Failed to remove product from cart. Please try again.");
    } finally {
      setProcessingCartProductId(null);
    }
  };

  const hasError = error || cartError;
  const isAllLoading = isLoading || isCartLoading;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4 dark:text-white flex items-center">
        <Heart className="mr-2 text-red-500" size={28} /> My Favourites
      </h1>

      {isAllLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary-500" size={48} />
          <p className="ml-4 text-xl text-gray-500 dark:text-gray-400">
            Loading your data...
          </p>
        </div>
      )}

      {hasError && (
        <div className="flex justify-center items-center h-64 text-red-500 dark:text-red-400">
          <XCircle className="mr-2" size={24} />
          <p>Error: {error || cartError}</p>
        </div>
      )}

      {!isAllLoading && !hasError && favorites.length === 0 && (
        <div className="text-center p-8 bg-gray-100 rounded-lg dark:bg-gray-900">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            You don't have any favourite products yet.
          </p>
        </div>
      )}

      {!isAllLoading && !hasError && favorites.length > 0 && (
        <>
          <p className="text-gray-600 mb-6 dark:text-gray-300">
            You have {favorites.length} product(s) in your favourites
          </p>
          <div className="space-y-6">
            {favorites.map((product) => (
              <FavouriteProductCard
                key={product._id}
                product={product}
                onRemove={handleRemoveFavorite}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                isInCart={cartItems.includes(product.productId)}
                isRemovingFavorite={
                  processingCartProductId === product.productId
                }
                isProcessingCart={processingCartProductId === product.productId}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favourite;
