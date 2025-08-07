"use client";

import Error from "@/components/common/Error";
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validate = () => {
    const newErrors = {};
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 5)
      newErrors.password = "Password must be at least 5 characters.";
    return newErrors;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ password, email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: data.message || "Password reset successful.",
        });
        setPassword("");
        signOut({ callbackUrl: "/login" });
      } else {
        setMessage({ type: "error", text: data.error || "Reset failed." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Reset Your Password
      </h2>

      {message && (
        <div
          className={`mb-4 p-4 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-700"
              : "bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-700"
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <i className="fas fa-lock absolute left-3 top-3.5 text-gray-400"></i>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <i
              className={
                showPassword
                  ? "fas fa-eye-slash text-gray-400 hover:text-gray-600"
                  : "fas fa-eye text-gray-400 hover:text-gray-600"
              }
            ></i>
          </button>
        </div>
        <Error message={errors?.password} />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200 transform hover:scale-105 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Resetting..." : "Set Password"}
        </button>
      </form>
    </div>
  );
}
