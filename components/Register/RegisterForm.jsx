"use client";
import validate from "@/utils/validate";
import { useRouter } from "next/navigation"; // Corrected import for useRouter
import { useState } from "react";
import Divider from "../common/Divider";
import Error from "../common/Error";
import Message from "../common/Message"; // Import Message component
import SocialLogin from "../common/SocialLogin";

const initialState = {
  userType: "customer",
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  phone: "",
  password: "",
  confirmPassword: "",
  bio: "",
  terms: false,
  profilePicture: null, // Add profilePicture to initial state
};

export default function RegisterForm({ onSubmit }) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password
  const [profilePreviewUrl, setProfilePreviewUrl] = useState(
    "data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100' height='100' fill='%23e5e7eb'/%3e%3ctext x='50%25' y='50%25' font-size='18' text-anchor='middle' alignment-baseline='middle' fill='%236b7280'%3ePhoto%3c/text%3e%3c/svg%3e"
  );
  const [uiMessage, setUiMessage] = useState({ type: "", text: "" }); // New state for UI messages
  const router = useRouter(); // Correctly initialize useRouter

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    // New toggle function
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setValues((prev) => ({ ...prev, [name]: file }));
      if (file) {
        setProfilePreviewUrl(URL.createObjectURL(file));
      } else {
        setProfilePreviewUrl(
          "data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100' height='100' fill='%23e5e7eb'/%3e%3ctext x='50%25' y='50%25' font-size='18' text-anchor='middle' alignment-baseline='middle' fill='%236b7280'%3ePhoto%3c/text%3e%3c/svg%3e"
        );
      }
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleRadio = (e) => {
    setValues((prev) => ({ ...prev, userType: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiMessage({ type: "", text: "" });
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setSubmitting(true);

    try {
      const formPayload = new FormData();
      for (const key in values) {
        formPayload.append(key, values[key]);
      }

      const response = await fetch("/api/register", {
        method: "POST",
        body: formPayload,
      });
      console.log(response);

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError);
          errorData.message = "Server returned an unexpected error format.";
        }
        setUiMessage({
          type: "error",
          text: errorData?.message || "Failed to register (unknown reason)",
        });
        console.error("Server error data:", errorData);
      } else {
        setUiMessage({
          type: "success",
          text: "Your account has been created",
        });
        setValues(initialState); // Reset form values on success
        setProfilePreviewUrl(
          "data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100' height='100' fill='%23e5e7eb'/%3e%3ctext x='50%25' y='50%25' font-size='18' text-anchor='middle' alignment-baseline='middle' fill='%236b7280'%3ePhoto%3c/text%3e%3c/svg%3e"
        );
        router.push("/login"); // Redirect to login page
      }

      // No longer need to manually parse success result or call onSubmit(result)
      // if (onSubmit) { onSubmit(result); }
    } catch (error) {
      console.error("Registration network error:", error.message);
      setUiMessage({
        type: "error",
        text: "Network error or unexpected client error.",
      }); // Generic error for network issues
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* <!-- Account Type - Full Width --> */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          I want to register as:
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="relative group">
            <input
              type="radio"
              name="userType"
              value="customer"
              className="sr-only peer"
              checked={values.userType === "customer"}
              onChange={handleRadio}
            />
            <div className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 dark:peer-checked:bg-primary-900 hover:border-primary-300 dark:hover:border-primary-400 transition-all duration-200">
              <div className="text-center">
                <i className="fas fa-user text-2xl mb-3 text-gray-600 dark:text-gray-400 peer-checked:text-primary-600 group-hover:text-primary-500 transition-colors"></i>
                <div className="font-semibold text-gray-900 dark:text-white peer-checked:text-primary-700 dark:peer-checked:text-primary-300">
                  Customer
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Buy fresh produce
                </div>
              </div>
            </div>
          </label>
          <label className="relative group">
            <input
              type="radio"
              name="userType"
              value="farmer"
              className="sr-only peer"
              checked={values.userType === "farmer"}
              onChange={handleRadio}
            />
            <div className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 dark:peer-checked:bg-primary-900 hover:border-primary-300 dark:hover:border-primary-400 transition-all duration-200">
              <div className="text-center">
                <i className="fas fa-tractor text-2xl mb-3 text-gray-600 dark:text-gray-400 peer-checked:text-primary-600 group-hover:text-primary-500 transition-colors"></i>
                <div className="font-semibold text-gray-900 dark:text-white peer-checked:text-primary-700 dark:peer-checked:text-primary-300">
                  Farmer
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Sell your produce
                </div>
              </div>
            </div>
          </label>
        </div>
        <Error message={errors.userType} />
      </div>

      {/* <!-- Profile Picture - Full Width --> */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Profile Picture
        </label>
        <div className="flex items-center justify-center space-x-6">
          {/* <!-- Image Preview --> */}
          <div className="shrink-0">
            <img
              id="profilePreview"
              className="h-20 w-20 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600"
              src={profilePreviewUrl}
              alt="Profile preview"
            />
          </div>
          {/* <!-- Upload Button --> */}
          <div className="flex-1 max-w-xs">
            <label
              htmlFor="profilePicture"
              className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus-within:outline-none focus-within:ring-2 focus:ring-offset-2 focus-within:ring-primary-500 transition block text-center"
            >
              <span className="flex items-center justify-center">
                <i className="fas fa-camera mr-2"></i>
                Choose photo
              </span>
              <input
                id="profilePicture"
                name="profilePicture"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleChange}
              />
            </label>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
              PNG, JPG, GIF up to 2MB
            </p>
          </div>
        </div>
        <Error message={errors.profilePicture} />
      </div>

      {/* <!-- Two Column Layout for Form Fields --> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <!-- Left Column --> */}
        <div className="space-y-4">
          {/* <!-- First Name --> */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="John"
              value={values.firstName}
              onChange={handleChange}
            />
            <Error message={errors.firstName} />
          </div>

          {/* <!-- Email --> */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="john@example.com"
              value={values.email}
              onChange={handleChange}
            />
            <Error message={errors.email} />
          </div>

          {/* <!-- Address --> */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Enter your full address"
              value={values.address}
              onChange={handleChange}
            ></textarea>
            <Error message={errors.address} />
          </div>

          {/* <!-- Password --> */}
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
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility} // Use specific toggle function
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
        </div>

        {/* <!-- Right Column --> */}
        <div className="space-y-4">
          {/* <!-- Last Name --> */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Doe"
              value={values.lastName}
              onChange={handleChange}
            />
            <Error message={errors.lastName} />
          </div>

          {/* <!-- Phone --> */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="+880 1234 567890"
              value={values.phone}
              onChange={handleChange}
            />
            <Error message={errors.phone} />
          </div>

          {/* <!-- Bio --> */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Bio{" "}
              <span className="text-gray-400 text-xs font-normal">
                (Optional)
              </span>
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              maxLength="250"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Tell us about yourself..."
              value={values.bio}
              onChange={handleChange}
            ></textarea>
            <Error message={errors.bio} />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Brief description
              </p>
              <span className="text-xs text-gray-400">
                {values.bio.length}/250
              </span>
            </div>
          </div>

          {/* <!-- Confirm Password --> */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"} // Use specific state
                // required
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
                value={values.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility} // Use specific toggle function
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i
                  className={
                    showConfirmPassword
                      ? "fas fa-eye-slash text-gray-400 hover:text-gray-600"
                      : "fas fa-eye text-gray-400 hover:text-gray-600"
                  }
                ></i>
              </button>
            </div>
            <Error message={errors.confirmPassword} />
          </div>
        </div>
      </div>

      {/* <!-- Terms and Conditions --> */}
      <div className="flex items-start">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          className={`mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${
            errors.terms ? "border-red-500" : ""
          }`}
          checked={values.terms}
          onChange={handleChange}
        />
        <label
          htmlFor="terms"
          className="ml-2 text-sm text-gray-600 dark:text-gray-400"
        >
          I agree to the
          <a href="#" className="text-primary-600 hover:text-primary-500">
            {" "}
            Terms and Conditions{" "}
          </a>
          and
          <a href="#" className="text-primary-600 hover:text-primary-500">
            {" "}
            Privacy Policy{" "}
          </a>
        </label>
      </div>
      <Error message={errors.terms} />

      {/* <!-- Submit Button --> */}
      <button
        type="submit"
        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200 transform hover:scale-105"
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Create Account"}
      </button>
      <Divider>Or continue with</Divider>
      <SocialLogin />
      <Message type={uiMessage.type} message={uiMessage.text} />
    </form>
  );
}
