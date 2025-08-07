import { auth } from "@/auth";
import { Orders } from "@/model/orders-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the product ID from the URL parameters
    const { productId } = params;

    // Get the user session to identify the logged-in user
    const session = await auth();
    const userId = session?.user?.id;

    // If there is no logged-in user, they can't have a purchase history
    if (!userId) {
      return NextResponse.json(
        { hasPurchased: false, message: "User not authenticated." },
        { status: 401 }
      );
    }

    // Basic validation to ensure the productId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { hasPurchased: false, message: "Invalid productId provided." },
        { status: 400 }
      );
    }

    // Query the Orders collection to check for a purchase with a "delivered" status.
    const order = await Orders.findOne({
      customer: userId,
      "items.product": new mongoose.Types.ObjectId(productId),
      orderStatus: "delivered", // Added this condition
    }).lean();

    // Determine the purchase status based on whether a delivered order was found
    const hasPurchased = !!order;

    return NextResponse.json(
      { success: true, hasPurchased: hasPurchased },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ GET /api/products/[productId]/purchase-status error:",
      error
    );
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
