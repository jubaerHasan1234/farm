import { auth } from "@/auth";
import { Orders } from "@/model/orders-model";
// Ensure Products model is imported if 'items.product' is populated
import { Products } from "@/model/product-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// Ensure all models are registered to avoid MissingSchemaError when populating
import "@/model/user-modal";

export async function GET(req) {
  try {
    await dbConnect();

    const session = await auth();
    const userId = session?.user?.id; // Get the ID of the logged-in user

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentUserIdObjectId = new mongoose.Types.ObjectId(userId);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const statusFilter = searchParams.get("status"); // e.g., "pending", "confirmed"

    const limit = 4;
    const skip = (page - 1) * limit;

    // Build initial query for Orders
    const orderQuery = {};
    if (
      statusFilter &&
      ["pending", "confirmed", "shipped", "delivered", "cancelled"].includes(
        statusFilter
      )
    ) {
      orderQuery.orderStatus = statusFilter;
    }

    // 1. Fetch orders based on status and pagination,
    //    and populate 'items.product' to get the 'createdBy' field from the product.
    const orders = await Orders.find(orderQuery)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit)
      .populate("customer", "firstName lastName email") // Populate customer details
      .populate({
        path: "items.product", // Path to the product reference within each item
        select: "_id createdBy productName price images", // Select necessary fields from Product, including _id and createdBy
      })
      .lean(); // Use .lean() for performance as we're filtering in JS

    // 2. Filter the fetched orders based on whether any product in the order was created by the logged-in user.
    const filteredOrders = orders.filter((order) => {
      return order.items.some((item) => {
        // Ensure product is populated and has createdBy field
        if (item.product && item.product.createdBy) {
          const productCreatorId = new mongoose.Types.ObjectId(
            item.product.createdBy
          );
          return productCreatorId.equals(currentUserIdObjectId);
        }
        return false; // Product or createdBy is missing for this item
      });
    });

    // 3. Get total count for pagination metadata (total orders matching status and createdBy filter)
    // This requires a separate query.
    // We need to use aggregation here to correctly count orders where *any* item's product was created by the user.
    const totalOrdersCountPipeline = [
      {
        $match: orderQuery, // Apply status filter first
      },
      {
        $unwind: "$items", // Deconstruct the items array
      },
      {
        $lookup: {
          from: Products.collection.name, // The collection name for Products model
          localField: "items.product",
          foreignField: "_id",
          as: "populatedProduct",
        },
      },
      {
        $unwind: "$populatedProduct", // Deconstruct the populated product array
      },
      {
        $match: {
          "populatedProduct.createdBy": currentUserIdObjectId, // Match by product's createdBy
        },
      },
      {
        $group: {
          _id: "$_id", // Group back by order ID to get unique orders
        },
      },
      {
        $count: "total", // Count the unique orders
      },
    ];

    const totalCountResult = await Orders.aggregate(totalOrdersCountPipeline);
    const totalOrders =
      totalCountResult.length > 0 ? totalCountResult[0].total : 0;
    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json({
      success: true,
      orders: filteredOrders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("❌ Order GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
