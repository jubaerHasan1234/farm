"use client";
import { useEffect, useState } from "react";

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false); // ✅ Prevent hydration mismatch

  useEffect(() => {
    // Get saved preference or fallback to system
    const saved = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const enabled = saved ? saved === "true" : prefersDark;
    setIsDarkMode(enabled);
    document.documentElement.classList.toggle("dark", enabled);

    setMounted(true); // ✅ Now it's safe to show UI

    // Watch for system changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (!localStorage.getItem("darkMode")) {
        const newPref = mediaQuery.matches;
        setIsDarkMode(newPref);
        document.documentElement.classList.toggle("dark", newPref);
      }
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDarkMode;
    setIsDarkMode(newDark);
    localStorage.setItem("darkMode", newDark);
    document.documentElement.classList.toggle("dark", newDark);
  };

  return { isDarkMode, toggleDarkMode, mounted };
};

export default useDarkMode;
