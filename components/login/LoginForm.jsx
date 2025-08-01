"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // Corrected import
import { useState } from "react";
import loginValidate from "../../utils/loginValidate";
import Divider from "../common/Divider";
import Error from "../common/Error";
import Message from "../common/Message"; // Import Message component
import SocialLogin from "../common/SocialLogin";
export default function LoginForm() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [uiMessage, setUiMessage] = useState({ type: "", text: "" }); // New state for UI messages
  const [loading, setLoading] = useState(false); // New loading state

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiMessage({ type: "", text: "" }); // Clear previous messages on new submission
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    const newErrors = loginValidate(data);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true); // Set loading to true
      try {
        const response = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false, // prevent full page redirect
        });

        if (response?.error) {
          console.error(response.error);
          setUiMessage({
            type: "error",
            text: "Your email or password is incorrect.",
          });
        } else {
          setUiMessage({ type: "success", text: "Login successful!" });

          router.refresh();

          router.push("/");
        }
      } catch (error) {
        console.error("Login error:", error);
        setUiMessage({
          type: "error",
          text: "Your email or password wrong.",
        }); // Set error message
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    } else {
      console.error("Form has validation errors:", newErrors);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Message type={uiMessage.type} message={uiMessage.text} />
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
            // required
            className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="john@example.com"
          />
          <i className="fas fa-envelope absolute left-3 top-3.5 text-gray-400"></i>
        </div>
        <Error message={errors.email} />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            // required
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="••••••••"
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
        <Error message={errors.password} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember"
            className="ml-2 text-sm text-gray-600 dark:text-gray-400"
          >
            Remember me
          </label>
        </div>

        <a
          href="forgot-password.html"
          className="text-sm text-primary-600 hover:text-primary-500"
        >
          Forgot password?
        </a>
      </div>
      <Error message={errors.remember} />
      <button
        type="submit"
        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200 transform hover:scale-105"
        disabled={loading} // Disable button when loading
      >
        {loading ? "Signing In..." : "Sign In"}{" "}
        {/* Change button text when loading */}
      </button>

      {/* <!-- Divider --> */}
      <Divider>Or continue with</Divider>

      {/* <!-- Social Login --> */}
      <SocialLogin />
    </form>
  );
}
