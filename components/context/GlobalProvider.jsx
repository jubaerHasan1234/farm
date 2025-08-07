"use client";

import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0); // ✅ favorite count

  // Fetch counts on mount
  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) return;
        const data = await res.json();
        const count = data.cart?.length || 0;
        setCartCount(count);
      } catch (e) {
        console.error("❌ Cart fetch failed:", e);
      }
    }

    async function fetchFavorites() {
      try {
        const res = await fetch("/api/favorites");
        if (!res.ok) return;
        const data = await res.json();
        setFavoriteCount(data.favorites?.length || 0); // ✅ only count
      } catch (e) {
        console.error("❌ Favorites fetch failed:", e);
      }
    }

    fetchCart();
    fetchFavorites();
  }, []);

  // ✅ Expose updater functions
  const updateCartCount = (count) => setCartCount(count);
  const updateFavoriteCount = (count) => setFavoriteCount(count);

  return (
    <GlobalContext.Provider
      value={{
        cartCount,
        favoriteCount, // ✅ expose favoriteCount
        updateCartCount,
        updateFavoriteCount, // ✅ expose update function
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
