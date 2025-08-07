"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import React, { useCallback, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners"; // For loading indicators

import { Pagination } from "../Products/UserProduct"; // Your modified Pagination
import OrdersHeader from "./OrdersHeader"; // Your modified OrdersHeader

// Helper to format price
const formatPrice = (price) => `৳${Number(price).toFixed(2)}`;

export default function FarmerOrders() {
  const router = useRouter(); // Initialize useRouter

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null); // To track which order is being updated
  const [deletingOrderId, setDeletingOrderId] = useState(null); // New state for delete loading

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Construct the URL with query parameters
      let url = `/api/manage-order?page=${currentPage}`; // Assuming this is your API route for farmer orders
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders.");
      }

      setOrders(data.orders);
      setTotalPages(data.pagination.totalPages);
      setTotalOrders(data.pagination.totalOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]); // Dependencies: re-fetch when page or filter changes

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); // Trigger fetch when `fetchOrders` callback changes

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Function to get the current status timeline for display
  const getStatusTimeline = (currentStatus) => {
    const statuses = ["pending", "confirmed", "shipped", "delivered"];
    const timeline = statuses.map((status) => ({
      status: status,
      isCurrent: status === currentStatus,
      isCompleted: statuses.indexOf(status) < statuses.indexOf(currentStatus),
    }));
    return timeline;
  };

  const handleUpdateOrderStatus = useCallback(
    async (orderId, newStatus) => {
      setUpdatingOrderId(orderId); // Set loading state for this specific order
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderStatus: newStatus,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Failed to update order status to ${newStatus}.`
          );
        }

        await fetchOrders(); // Re-fetch all orders to reflect the change
      } catch (err) {
        console.error(`Error updating order ${orderId} status:`, err);
      } finally {
        setUpdatingOrderId(null); // Clear loading state
      }
    },
    [fetchOrders]
  );

  const handleConfirmOrder = useCallback(
    (orderId) => {
      // Redirect to the specific order details page (e.g., for payment confirmation)
      router.push(`/payment/${orderId}`);
    },
    [router]
  );

  //  handle delete
  const handleDeleteOrder = useCallback(
    async (orderId) => {
      setDeletingOrderId(orderId); // Set loading state for this specific order
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

        await fetchOrders(); // Re-fetch orders to remove the deleted one from the list
      } catch (err) {
        console.error(`Error deleting order ${orderId}:`, err);
      } finally {
        setDeletingOrderId(null); // Clear loading state
      }
    },
    [fetchOrders]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={50} color="#4A90E2" />
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">
          Loading orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 dark:text-red-400">
        <p>Error: {error}</p>
        <button
          onClick={fetchOrders} // Retry fetching
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <OrdersHeader
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        totalOrders={totalOrders}
      />
      <div className="space-y-6 ">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <p className="text-2xl font-semibold mb-4">No orders found.</p>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Order #{order._id.substring(0, 8).toUpperCase()}{" "}
                        {/* Shorten ID for display */}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
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
                      key={item.product?._id || item.productId || itemIndex}
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
                        className="rounded-md object-cover w-[80px] h-[80px]" // Ensure fixed size for Next/Image
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.productName || "Unnamed Product"}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          By{" "}
                          {item.product?.createdBy?.firstName ||
                            item.product?.createdBy?.email ||
                            "Unknown Farmer"}{" "}
                          {/* Display farmer name if populated, otherwise 'Unknown Farmer' */}
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
                    {" "}
                    {/* Added overflow-x-auto */}
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Current status:{" "}
                    {order.orderStatus.charAt(0).toUpperCase() +
                      order.orderStatus.slice(1)}
                  </p>
                </div>

                {/* <!-- Action Buttons --> */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4 flex flex-wrap gap-3">
                  {order.orderStatus === "pending" && (
                    <>
                      <button
                        onClick={() => handleConfirmOrder(order._id)} // Redirect on confirm
                        className="flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition"
                        disabled={
                          updatingOrderId === order._id ||
                          deletingOrderId === order._id
                        }
                      >
                        {updatingOrderId === order._id ? (
                          <ClipLoader size={20} color="#fff" />
                        ) : (
                          <>
                            <i className="fas fa-check mr-2"></i> Confirm Order
                          </>
                        )}
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(order._id, "cancelled")
                        }
                        className="flex items-center px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg font-medium transition"
                        disabled={
                          updatingOrderId === order._id ||
                          deletingOrderId === order._id
                        }
                      >
                        {updatingOrderId === order._id ? (
                          <ClipLoader size={20} color="#dc2626" />
                        ) : (
                          <>
                            <i className="fas fa-times mr-2"></i> Cancel Order
                          </>
                        )}
                      </button>
                    </>
                  )}
                  {order.orderStatus === "confirmed" && (
                    <button
                      onClick={() =>
                        handleUpdateOrderStatus(order._id, "shipped")
                      }
                      className="flex items-center px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-medium transition"
                      disabled={
                        updatingOrderId === order._id ||
                        deletingOrderId === order._id
                      }
                    >
                      {updatingOrderId === order._id ? (
                        <ClipLoader size={20} color="#fff" />
                      ) : (
                        <>
                          <i className="fas fa-truck mr-2"></i> Mark as Shipped
                        </>
                      )}
                    </button>
                  )}
                  {order.orderStatus === "shipped" && (
                    <button
                      onClick={() =>
                        handleUpdateOrderStatus(order._id, "delivered")
                      }
                      className="flex items-center px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium transition"
                      disabled={
                        updatingOrderId === order._id ||
                        deletingOrderId === order._id
                      }
                    >
                      {updatingOrderId === order._id ? (
                        <ClipLoader size={20} color="#fff" />
                      ) : (
                        <>
                          <i className="fas fa-box-open mr-2"></i> Mark as
                          Delivered
                        </>
                      )}
                    </button>
                  )}
                  {order.orderStatus === "cancelled" && (
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="flex items-center px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition"
                      disabled={
                        deletingOrderId === order._id ||
                        updatingOrderId === order._id
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
                  )}
                  {/* --- NEW: Delete button for 'delivered' orders --- */}
                  {order.orderStatus === "delivered" && (
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="flex items-center px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition"
                      disabled={
                        deletingOrderId === order._id ||
                        updatingOrderId === order._id
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
                  )}
                  {/* --- END NEW --- */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
