import { auth } from "@/auth";
import { Orders } from "@/model/orders-model";
import "@/model/product-model"; // ensure Products schema is registered
import { Products } from "@/model/product-model";
import { Users } from "@/model/user-modal"; // Required to avoid MissingSchemaError
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
const _forceModelImport = [Products, Users];
/**
 * Fetch an order by its ID with optional population of refs.
 * Throws on invalid ID or not found.
 */
async function fetchOrderById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("InvalidOrderId");
  }

  // Populate refs: customer info and product details inside items
  const order = await Orders.findById(id)
    .populate("customer", "firstName lastName email")
    .populate("items.product", "productName price images unit");

  if (!order) {
    throw new Error("OrderNotFound");
  }

  return order;
}

// GET /api/orders/[id]
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    const order = await fetchOrderById(id);

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("❌ GET /api/orders/[id] error:", error);

    if (error.message === "InvalidOrderId") {
      return NextResponse.json(
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    if (error.message === "OrderNotFound") {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id]
// Helper to deep merge objects (simple shallow merge for demo)
function mergeObjects(target, source) {
  return { ...target, ...source };
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const data = await req.json();

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: "No update data provided" },
        { status: 400 }
      );
    }

    const order = await fetchOrderById(id);

    // Allowed fields to update
    const allowedFields = [
      "orderStatus",
      "paymentStatus",
      "shippingAddress",
      "paymentMethod",
      "items",
      "totalAmount",
      "shippingCost",
      "serviceFee",
    ];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        if (
          field === "shippingAddress" &&
          typeof data.shippingAddress === "object" &&
          data.shippingAddress !== null
        ) {
          // Merge partial shippingAddress updates, preserve existing fields
          order.shippingAddress = mergeObjects(
            order.shippingAddress || {},
            data.shippingAddress
          );
        } else if (field === "items" && Array.isArray(data.items)) {
          order.items = data.items.map((item, idx) => {
            const existingItem = order.items?.[idx] || {};
            return {
              ...(existingItem.toObject
                ? existingItem.toObject()
                : existingItem),
              ...item,
            };
          });
        } else {
          // Normal field update
          order[field] = data[field];
        }
      }
    }

    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("❌ PUT /api/orders/[id] error:", error);

    if (error.message === "InvalidOrderId") {
      return NextResponse.json(
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    if (error.message === "OrderNotFound") {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// delete handler

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = params; // Get order ID from dynamic route parameter

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    // Optional: Authenticate user if only specific users can delete orders
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const orderToDelete = await Orders.findById(id).populate(
      "items.product",
      "stock" // Only need stock for reversion
    );

    if (!orderToDelete) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // 2. Revert stock for each product in the order
    const stockReversionPromises = orderToDelete.items.map(async (item) => {
      // Ensure product reference is valid and populated
      if (item.product && item.product._id) {
        const productToUpdate = await Products.findById(item.product._id);
        if (productToUpdate) {
          productToUpdate.stock += item.quantity; // Add quantity back to stock
          await productToUpdate.save();
        } else {
          console.warn(
            `Product with ID ${item.product._id} not found during order deletion for stock reversion.`
          );
        }
      }
    });

    await Promise.all(stockReversionPromises); // Wait for all stock updates to complete

    // 3. Delete the order from the database
    const deletedOrder = await Orders.findByIdAndDelete(id);

    if (!deletedOrder) {
      // This check is mostly for redundancy, as orderToDelete already confirmed existence
      return NextResponse.json(
        { success: false, message: "Order not found for deletion" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully and stock reverted.",
      deletedOrder,
    });
  } catch (error) {
    console.error("❌ DELETE /api/orders/[id] error:", error);

    if (error.message === "InvalidOrderId") {
      return NextResponse.json(
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
