import { auth } from "@/auth";
import { Orders } from "@/model/orders-model";
import "@/model/product-model"; // Ensure Products schema is registered
import { Users } from "@/model/user-modal";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";

// Ensure Users model is registered for population
import "@/model/user-modal";

export async function GET(req) {
  try {
    await dbConnect();

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch orders for the logged-in user
    // Populate product details and specifically include the 'reviews' array
    const orders = await Orders.find({ customer: userId })
      .populate("customer", "firstName lastName email")
      .populate({
        path: "items.product",
        select: "productName price images reviews", // IMPORTANT: Select 'reviews' here
      })
      .lean(); // Use .lean() to easily modify the plain JavaScript objects

    // Process orders to add hasUserReviewed flag for each item
    const processedOrders = orders.map((order) => {
      const itemsWithReviewStatus = order.items.map((item) => {
        // Check if product exists and if the user has reviewed it
        const hasUserReviewed =
          item.product && item.product.reviews
            ? item.product.reviews.some(
                (review) => String(review.user) === String(userId)
              )
            : false;

        // Create a new product object without the full reviews array
        // to avoid sending potentially large/sensitive data to the client
        const { reviews, ...productWithoutReviews } = item.product || {};

        return {
          ...item,
          product: productWithoutReviews, // Send product data without its full reviews array
          hasUserReviewed: hasUserReviewed, // Add the flag for client-side use
        };
      });

      return {
        ...order,
        items: itemsWithReviewStatus,
      };
    });

    return NextResponse.json({ success: true, orders: processedOrders });
  } catch (error) {
    console.error("❌ Order GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// post handeler

export async function POST(req) {
  try {
    await dbConnect();
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      items,
      paymentMethod = "sslcommerz",
      totalAmount,
      shippingCost,
      serviceFee,
    } = body;

    if (!Array.isArray(items) || items.length === 0 || totalAmount == null) {
      return NextResponse.json(
        { success: false, message: "Invalid order data" },
        { status: 400 }
      );
    }

    // ✅ Try to get user info
    const user = await Users.findById(userId);

    const shippingAddress = {
      fullName: user?.firstName
        ? `${user.firstName} ${user?.lastName || ""}`.trim()
        : "Guest User",
      phone: user?.phone || "01700000000",
      addressLine: user?.address || "Demo Address Line",
      city: user?.city || "Dhaka",
      postalCode: user?.postalCode || "1200",
    };

    const newOrder = await Orders.create({
      customer: userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      shippingCost: shippingCost || 0,
      serviceFee: serviceFee || 0,
    });

    return NextResponse.json(
      { success: true, order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order POST error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// put handler
export async function PUT(req) {
  try {
    await dbConnect();

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId, updates } = body;

    if (!orderId || typeof updates !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid update data" },
        { status: 400 }
      );
    }

    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      { $set: updates },
      { new: true }
    )
      .populate("customer", "firstName lastName email")
      .populate("items.product", "productName price images");

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Order PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}
