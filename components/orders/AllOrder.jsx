"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import React, { useCallback, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

// Helper to format price
const formatPrice = (price) => `৳${Number(price).toFixed(2)}`;

export default function AllOrder() {
  const router = useRouter(); // Initialize useRouter

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingOrderId, setDownloadingOrderId] = useState(null);
  const [reorderingOrderId, setReorderingOrderId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null); // State for delete loading

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/orders"); // Call your API endpoint
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders.");
      }

      setOrders(data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusTimeline = (currentStatus) => {
    const statuses = ["pending", "confirmed", "shipped", "delivered"];
    const timeline = statuses.map((status) => ({
      status: status,
      isCurrent: status === currentStatus,
      isCompleted: statuses.indexOf(status) < statuses.indexOf(currentStatus),
    }));
    return timeline;
  };

  const handleDownloadReceipt = useCallback((order) => {
    if (!order || !order.pdf) {
      alert("PDF not available for download."); // IMPORTANT: Replace with a custom modal/toast in production
      return;
    }

    setDownloadingOrderId(order._id);
    try {
      const blob = new Blob(
        [Uint8Array.from(atob(order.pdf), (c) => c.charCodeAt(0))],
        { type: "application/pdf" }
      );
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `order_${order._id}_receipt.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading receipt:", error);
    } finally {
      setDownloadingOrderId(null);
    }
  }, []);

  const handleReorder = useCallback(
    async (orderToReorder) => {
      setReorderingOrderId(orderToReorder._id);
      try {
        const reorderItems = orderToReorder.items.map((item) => ({
          product: item.product?._id || item.product,
          quantity: item.quantity,
          price: item.price,
          unit: item.unit,
          productName: item.productName,
          image: item.image,
          farmerId: item.farmerId, // Ensure this field exists on your order item
        }));

        const newTotalAmount = reorderItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const newShippingCost = orderToReorder.shippingCost || 0;
        const newServiceFee = orderToReorder.serviceFee || 0;

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: reorderItems,
            paymentMethod: orderToReorder.paymentMethod,
            totalAmount: newTotalAmount + newShippingCost + newServiceFee,
            shippingCost: newShippingCost,
            serviceFee: newServiceFee,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to create reorder.");
        }

        router.push(`/payment/${data.order._id}`);
      } catch (err) {
        console.error("Error reordering:", err);
      } finally {
        setReorderingOrderId(null);
      }
    },
    [router]
  );

  const handleDeleteOrder = useCallback(
    async (orderId) => {
      setDeletingOrderId(orderId);
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Failed to delete order ${orderId.substring(0, 8)}.`
          );
        }

        await fetchOrders();
      } catch (err) {
        console.error(`Error deleting order ${orderId}:`, err);
      } finally {
        setDeletingOrderId(null);
      }
    },
    [fetchOrders]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={50} color="#4A90E2" />
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">
          Loading your orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 dark:text-red-400">
        <p>Error: {error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        <p className="text-2xl font-semibold mb-4">No orders found.</p>
        <p>You haven't placed any orders yet.</p>
        <Link
          href="/products"
          className="mt-4 inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        My All Orders
      </h1>{" "}
      {/* Added title */}
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order #{order._id.substring(0, 8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    order.orderStatus === "delivered"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : order.orderStatus === "confirmed"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : order.orderStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : order.orderStatus === "shipped"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      : order.orderStatus === "cancelled"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  <i
                    className={`fas ${
                      order.orderStatus === "pending"
                        ? "fa-clock"
                        : order.orderStatus === "confirmed"
                        ? "fa-check-circle"
                        : order.orderStatus === "shipped"
                        ? "fa-truck"
                        : order.orderStatus === "delivered"
                        ? "fa-box-open"
                        : order.orderStatus === "cancelled"
                        ? "fa-times-circle"
                        : "fa-info-circle"
                    } mr-1`}
                  ></i>
                  {order.orderStatus.toUpperCase()}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* <!-- Order Items --> */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              {order.items.map((item, itemIndex) => (
                <div
                  key={item.product?._id || itemIndex}
                  className="flex items-center space-x-4 mb-4 last:mb-0"
                >
                  <Image
                    src={
                      item.image ||
                      "https://placehold.co/80x80/e0e0e0/000000?text=No+Image"
                    }
                    alt={item.productName || "Product"}
                    width={80}
                    height={80}
                    className="rounded-md object-cover w-[80px] h-[80px]"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.productName || "Unnamed Product"}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      By{" "}
                      {order.customer?.firstName ||
                        order.customer?.email ||
                        "Unknown Customer"}{" "}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quantity: {item.quantity} {item.unit} •{" "}
                      {formatPrice(item.price)}/{item.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* <!-- Order Status Timeline --> */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Order Status
              </h4>
              <div className="flex items-center space-x-4 text-sm overflow-x-auto pb-2">
                {getStatusTimeline(order.orderStatus).map(
                  (status, index, arr) => (
                    <React.Fragment key={status.status}>
                      <div
                        className={`flex items-center ${
                          status.isCurrent
                            ? "text-primary-600 dark:text-primary-400"
                            : status.isCompleted
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        <i
                          className={`fas ${
                            status.isCurrent
                              ? "fa-clock"
                              : status.isCompleted
                              ? "fa-check-circle"
                              : "fa-circle"
                          } mr-1`}
                        ></i>
                        <span>
                          {status.status.charAt(0).toUpperCase() +
                            status.status.slice(1)}
                        </span>
                      </div>
                      {index < arr.length - 1 && (
                        <div
                          className={`w-8 h-0.5 ${
                            status.isCompleted
                              ? "bg-green-600"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        ></div>
                      )}
                    </React.Fragment>
                  )
                )}
              </div>
            </div>

            {/* <!-- Action Buttons --> */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => handleDownloadReceipt(order)}
                className={`flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition
                  ${
                    downloadingOrderId === order._id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                disabled={downloadingOrderId === order._id || !order.pdf}
              >
                {downloadingOrderId === order._id ? (
                  <ClipLoader size={20} color="#fff" />
                ) : (
                  <>
                    <i className="fas fa-download mr-2"></i>
                    Download Receipt
                  </>
                )}
              </button>
              {order.orderStatus === "delivered" &&
                // Conditionally render based on hasUserReviewed flag
                (order.items[0]?.hasUserReviewed ? ( // Assuming one product per order for simplicity, or check each item
                  <button
                    className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-lg font-medium transition cursor-not-allowed"
                    disabled
                  >
                    <i className="fas fa-check-circle mr-2"></i>
                    Review Submitted
                  </button>
                ) : (
                  <Link
                    href={`/rating/${order.items[0].product?._id}`}
                    className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition"
                  >
                    <i className="fas fa-star mr-2"></i>
                    Write Review
                  </Link>
                ))}
              {order.orderStatus !== "cancelled" && (
                <button
                  onClick={() => handleReorder(order)}
                  className={`flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition
                    ${
                      reorderingOrderId === order._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  disabled={reorderingOrderId === order._id}
                >
                  {reorderingOrderId === order._id ? (
                    <ClipLoader size={20} color="#dc2626" />
                  ) : (
                    <>
                      <i className="fas fa-redo mr-2"></i>
                      Reorder
                    </>
                  )}
                </button>
              )}

              {order.orderStatus === "pending" && (
                <Link
                  href={`/payment/${order._id}`}
                  className={`flex items-center px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium transition
                    ${
                      reorderingOrderId === order._id ||
                      downloadingOrderId === order._id ||
                      deletingOrderId === order._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                >
                  <i className="fas fa-money-bill-wave mr-2"></i> Make Payment
                </Link>
              )}

              {/* Delete button for all orders */}
              <button
                onClick={() => handleDeleteOrder(order._id)}
                className="flex items-center px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition"
                disabled={
                  deletingOrderId === order._id ||
                  reorderingOrderId === order._id ||
                  downloadingOrderId === order._id
                }
              >
                {deletingOrderId === order._id ? (
                  <ClipLoader size={20} color="#fff" />
                ) : (
                  <>
                    <i className="fas fa-trash-alt mr-2"></i> Delete Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
