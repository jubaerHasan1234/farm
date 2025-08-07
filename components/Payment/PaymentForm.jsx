"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import Message from "../common/Message";

export default function PaymentForm({ order }) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    mobileNumber: "",
    billingSame: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (paymentMethod === "card") {
      if (!formData.cardName.trim()) newErrors.cardName = "Name is required";
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s+/g, "")))
        newErrors.cardNumber = "Card number must be 16 digits";

      if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = "CVV is invalid";
    } else if (paymentMethod === "bkash" || paymentMethod === "nagad") {
      if (!/^(?:\+8801|01)[3-9]\d{8}$/.test(formData.mobileNumber))
        newErrors.mobileNumber = "Enter valid BD mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrors({});

    if (validate()) {
      try {
        const res = await fetch(`/api/orders/${order._id}/success`, {
          method: "POST",
        });

        const data = await res.json();

        if (!res.ok) {
          setErrors({
            message: data.message || "Payment success processing failed.",
          });
          throw new Error(data.message || "Payment success processing failed.");
        } else {
          setLoading(false);
          setErrors({});
          router.push(`/success/${order._id}`);
        }
      } catch (error) {
        console.error("Payment error:", error);
        alert("Something went wrong during payment: " + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Payment Information
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Payment Method
          </label>
          <div className="space-y-3">
            {[
              {
                value: "card",
                label: "Credit/Debit Card",
                icon: "fa-credit-card",
              },
              { value: "bkash", label: "bKash", icon: "fa-mobile-alt" },
              { value: "nagad", label: "Nagad", icon: "fa-wallet" },
            ].map(({ value, label, icon }) => (
              <label
                key={value}
                className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={value}
                  checked={paymentMethod === value}
                  onChange={handlePaymentChange}
                />
                <div className="ml-3 flex items-center">
                  <i className={`fas ${icon} text-lg mr-2`}></i>
                  <span className="font-medium">{label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Card Details */}
        {paymentMethod === "card" && (
          <div className="space-y-4">
            {[
              { id: "cardName", label: "Name on Card", type: "text" },
              { id: "cardNumber", label: "Card Number", type: "text" },
              {
                id: "expiry",
                label: "Expiry Date",
                type: "text",
                placeholder: "MM/YY",
              },
              { id: "cvv", label: "CVV", type: "password", maxLength: 4 },
            ].map(({ id, label, type, ...rest }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {label}
                </label>
                <input
                  type={type}
                  id={id}
                  name={id}
                  value={formData[id]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  {...rest}
                />
                {errors[id] && (
                  <p className="text-sm text-red-500 mt-1">{errors[id]}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Mobile Payment */}
        {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
          <div>
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="+880 1XXXXXXXXX"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
            {errors.mobileNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.mobileNumber}</p>
            )}
          </div>
        )}

        {/* Billing Address Checkbox */}
        <div>
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              name="billingSame"
              checked={formData.billingSame}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Same as delivery address
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium text-lg transition duration-200 transform hover:scale-105"
          disabled={loading}
        >
          {loading ? (
            <ClipLoader speedMultiplier={0.5} size={20} color="#fff" />
          ) : (
            <i className="fas fa-lock mr-2"></i>
          )}
          Complete Payment - ৳
          {order?.totalAmount + order?.shippingCost + order?.serviceFee || 300}
        </button>

        <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          <i className="fas fa-shield-alt mr-2"></i>
          Your payment information is secure and encrypted
        </div>
      </form>
      <Message type="error" message={errors?.message} />
    </div>
  );
}
