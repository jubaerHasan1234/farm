import { auth } from "@/auth";
import { calculateAverageRating } from "@/lib/calculateAverageRating"; // Import the helper
import "@/model/orders-model";
import "@/model/product-model";
import { Products } from "@/model/product-model";
import "@/model/user-modal";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

function findReviewById(product, reviewId) {
  return product.reviews.id(reviewId); // Mongoose's .id() method is useful for subdocuments
}

// PUT /api/products/[productId]/reviews/[reviewId]
export async function PUT(req, { params }) {
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

    const { productId, reviewId } = params;
    const { rating, comment } = await req.json();

    // Input validation
    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(reviewId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid product or review ID" },
        { status: 400 }
      );
    }
    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be a number between 0 and 5" },
        { status: 400 }
      );
    }

    const product = await Products.findById(productId);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const reviewToUpdate = findReviewById(product, reviewId);

    if (!reviewToUpdate) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    // Authorization: Only the original reviewer can update their review
    if (String(reviewToUpdate.user) !== String(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to update this review.",
        },
        { status: 403 }
      );
    }

    // Update review fields
    reviewToUpdate.rating = rating;
    reviewToUpdate.comment = comment || ""; // Allow comment to be empty

    // Recalculate and update the overall product rating
    product.rating = calculateAverageRating(product.reviews);

    await product.save();

    return NextResponse.json(
      {
        success: true,
        message: "Review updated successfully!",
        review: reviewToUpdate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ PUT /api/products/[productId]/reviews/[reviewId] error:",
      error
    );
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[productId]/reviews/[reviewId]
export async function DELETE(req, { params }) {
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

    const { productId, reviewId } = params;

    // Input validation
    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(reviewId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid product or review ID" },
        { status: 400 }
      );
    }

    const product = await Products.findById(productId);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const reviewToDeleteIndex = product.reviews.findIndex(
      (review) => String(review._id) === String(reviewId)
    );

    if (reviewToDeleteIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    // Authorization: Only the original reviewer can delete their review
    if (String(product.reviews[reviewToDeleteIndex].user) !== String(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to delete this review.",
        },
        { status: 403 }
      );
    }

    // Remove the review from the array
    product.reviews.splice(reviewToDeleteIndex, 1);

    // Recalculate and update the overall product rating
    product.rating = calculateAverageRating(product.reviews);

    await product.save();

    return NextResponse.json(
      { success: true, message: "Review deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ DELETE /api/products/[productId]/reviews/[reviewId] error:",
      error
    );
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
