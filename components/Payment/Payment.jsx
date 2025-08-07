"use client";

import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import PaymentForm from "./PaymentForm";
import Summary from "./Summary";

export default function Payment({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);
  // refresh order

  const refreshOrder = async () => {
    const res = await fetch(`/api/orders/${order?.order?._id}`);
    const updatedOrder = await res.json();
    setOrder(updatedOrder);
  };
  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <ClipLoader speedMultiplier={0.5} size={50} color="#4fa94d" />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 py-8">Error: {error}</div>;
  if (!order) return <div className="text-center py-8">No order found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Summary order={order?.order} onOrderUpdated={refreshOrder} />
        <PaymentForm order={order?.order} />
      </div>
    </div>
  );
}
