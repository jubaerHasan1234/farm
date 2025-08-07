"use client";

import { useState } from "react";

export default function ForgetPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null); // { type: "success" | "error", text: string }
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    // Basic validation
    if (!email) {
      setMessage({ type: "error", text: "Email is required." });
      return;
    }

    if (!validateEmail(email)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: data.message || "Reset email sent.",
        });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Something went wrong.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Network error. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Email Address
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="john@example.com"
          />
          <i className="fas fa-envelope absolute left-3 top-3.5 text-gray-400"></i>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200 transform hover:scale-105 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <i className="fas fa-paper-plane mr-2"></i>
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      {message && (
        <div
          className={`rounded-lg p-4 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200"
          } border ${
            message.type === "success"
              ? "border-green-200 dark:border-green-700"
              : "border-red-200 dark:border-red-700"
          }`}
        >
          <i
            className={`fas ${
              message.type === "success"
                ? "fa-check-circle"
                : "fa-exclamation-circle"
            } mr-2`}
          ></i>
          {message.text}
        </div>
      )}
    </form>
  );
}
