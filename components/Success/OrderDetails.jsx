"use client";

import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

import { ActionButton, EmailNotification, SuccessIconAndMessage } from "..";
import Summary from "../Payment/Summary";
import PaymentDetails from "./PaymentDetails";

export default function OrderDetails({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        setError("Order ID not provided.");
        return;
      }

      try {
        setLoading(true);
        setError(null); // Clear previous errors

        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch order details.");
        }

        setOrder(data.order);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]); // Re-fetch if orderId changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 dark:bg-gray-900">
        <ClipLoader size={50} color="#4A90E2" />
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">
          Loading order details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 dark:text-red-400 dark:bg-gray-900">
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400 dark:bg-gray-900">
        <p className="text-2xl font-semibold mb-4">Order not found.</p>
        <p>Please check the order ID and try again.</p>
      </div>
    );
  }

  return (
    <>
      <SuccessIconAndMessage orderId={orderId} />
      <EmailNotification />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
        {/* Pass the fetched order data as a prop */}
        <Summary order={order} editButton={false} />
        <PaymentDetails order={order} />
      </div>
      <ActionButton order={order} />
    </>
  );
}
