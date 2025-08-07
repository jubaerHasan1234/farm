"use client";

import Image from "next/image";
import { useState } from "react";
import EditOrderModal from "./EditOrderModal"; // Import the new modal component

const Summary = ({ order, onOrderUpdated, editButton = true }) => {
  // State to control modal visibility, replacing the old isEditing state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Editable form state (initialize from order prop)
  const [formData, setFormData] = useState({
    shippingAddress: {
      addressLine: order?.shippingAddress?.addressLine || "",
      city: order?.shippingAddress?.city || "",
    },
    orderStatus: order?.orderStatus || "",
    paymentMethod: order?.paymentMethod || "",
    paymentStatus: order?.paymentStatus || "",
    items:
      order?.items?.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      })) || [],
  });

  if (!order || !order.items) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No order details available
        </div>
      </div>
    );
  }

  // Price calculations (same as before)
  const totalItems = order.items.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const subtotal = order.items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    const quantity = item.quantity || 0;
    return sum + price * quantity;
  }, 0);
  const shipping = order.shippingCost || 0;
  const serviceFee = order.serviceFee || 0;
  const total = subtotal + shipping + serviceFee;

  const formatPrice = (price) => `৳${price}`;

  // Format dates nicely
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle input changes for form
  const handleChange = (e, index = null) => {
    const { name, value } = e.target;

    if (name === "addressLine" || name === "city") {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [name]: value,
        },
      }));
    } else if (name === "quantity" && index !== null) {
      const updatedItems = [...formData.items];
      updatedItems[index].quantity = parseInt(value);
      setFormData((prev) => ({
        ...prev,
        items: updatedItems,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // total amoutn
  const totalAmount = formData.items.reduce((sum, item) => {
    const matchedProduct = order.items.find(
      (p) => p.product._id === item.productId
    );
    const price = matchedProduct?.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  // Handle update submit
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingAddress: formData.shippingAddress,
          orderStatus: formData.orderStatus,
          paymentMethod: formData.paymentMethod,
          paymentStatus: formData.paymentStatus,
          items: formData.items.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
          })),
          totalAmount,
        }),
      });

      if (!response.ok) throw new Error("Failed to update order");

      if (onOrderUpdated && response.ok) {
        await onOrderUpdated();
      }

      setIsModalOpen(false); // Close the modal on success
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error updating order: " + error.message);
    }
  };

  // Function to open the modal and reset form data
  const handleEditClick = () => {
    // Reset form data to current order details before opening the modal
    setFormData({
      shippingAddress: {
        addressLine: order?.shippingAddress?.addressLine || "",
        city: order?.shippingAddress?.city || "",
      },
      orderStatus: order?.orderStatus || "",
      paymentMethod: order?.paymentMethod || "",
      paymentStatus: order?.paymentStatus || "",
      items:
        order?.items?.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })) || [],
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    // Reset formData to the original order values
    setFormData({
      shippingAddress: {
        addressLine: order?.shippingAddress?.addressLine || "",
        city: order?.shippingAddress?.city || "",
      },
      orderStatus: order?.orderStatus || "",
      paymentMethod: order?.paymentMethod || "",
      paymentStatus: order?.paymentStatus || "",
      items:
        order?.items?.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })) || [],
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6  ">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Order Summary ({totalItems} {totalItems === 1 ? "item" : "items"})
      </h2>

      <div className="space-y-4">
        {/* Item List (Read-only) */}
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              {item.product?.images?.[0] && (
                <div className="flex-shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.productName || "Product"}
                    width={80}
                    height={80}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {item.product?.productName || "Unnamed Product"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Qty: {item.quantity} × {formatPrice(item.product?.price || 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  By{" "}
                  {`${order.customer?.firstName} ${order.customer?.lastName}` ||
                    order.customer?.name ||
                    "Unknown Farm"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice((item.product?.price || 0) * item.quantity)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatPrice(item.product?.price || 0)}/
                  {item.unit || item.product?.unit || "unit"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Booking & Delivery Details (Read-only) */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              Booking Date:
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatDate(order.createdAt)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              Last Updated:
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatDate(order.updatedAt)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              Delivery Address:
            </span>
            <span className="font-medium text-gray-900 dark:text-white text-right">
              {order.shippingAddress?.addressLine},{" "}
              {order.shippingAddress?.city}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">City:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {order.shippingAddress?.city}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              Order Status:
            </span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {order.orderStatus || "-"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              Payment Method:
            </span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {order.paymentMethod || "-"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              Payment Status:
            </span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {order.paymentStatus || "-"}
            </span>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="text-gray-900 dark:text-white">
              {formatPrice(subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Delivery Fee:
            </span>
            <span className="text-gray-900 dark:text-white">
              {formatPrice(shipping)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Service Fee:
            </span>
            <span className="text-gray-900 dark:text-white">
              {formatPrice(serviceFee)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-600 pt-2">
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {/* Edit Button */}
        {editButton && (
          <button
            className="w-full mt-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 rounded-lg font-medium transition"
            onClick={handleEditClick}
          >
            <i className="fas fa-edit mr-2"></i>Edit Order Details
          </button>
        )}

        {/* Modal Component */}
        <EditOrderModal
          isOpen={isModalOpen}
          onClose={handleCancel}
          formData={formData}
          handleChange={handleChange}
          handleUpdate={handleUpdate}
          loading={loading}
          orderItems={order.items}
          formatPrice={formatPrice}
        />
      </div>
    </div>
  );
};

export default Summary;
