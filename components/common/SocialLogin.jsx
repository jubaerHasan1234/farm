"use client";
import { signIn } from "next-auth/react";
export default function SocialLogin() {
  const handleAuth = (event) => {
    signIn("google", { callbackUrl: "/" });
  };
  return (
    <button
      type="button"
      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200 flex items-center justify-center space-x-2"
      onClick={handleAuth}
    >
      <i className="fab fa-google text-red-500"></i>
      <span>Continue with Google</span>
    </button>
  );
}
