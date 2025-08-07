import { auth } from "@/auth";
import { calculateAverageRating } from "@/lib/calculateAverageRating"; // Import the helper
import { Orders } from "@/model/orders-model";
import { Products } from "@/model/product-model";
import { Users } from "@/model/user-modal";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// Ensure all models are registered to avoid MissingSchemaError
import "@/model/orders-model";
import "@/model/product-model";
import "@/model/user-modal";

// get

export async function GET(req, { params }) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the product ID from the URL parameters
    const { productId } = params;

    // Get the page number from the URL query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "0", 10);
    const pageSize = 5;

    // Get the user session to identify the logged-in user
    const session = await auth();
    const userId = session?.user?.id;

    // Validate the provided productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Find the product by ID and select only the reviews array
    // Mongoose populate is used to get the user details for each review.
    const product = await Products.findById(productId)
      .select("reviews")
      .populate({
        path: "reviews.user",
        select: "name image", // Select the fields you need for the user
      });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const allReviews = product.reviews || [];
    const totalReviews = allReviews.length;
    let reviewsToReturn = [];

    // Find the user's review and separate it from the rest of the reviews.
    // This makes the pagination logic much cleaner.
    let userReview = null;
    let otherReviews = allReviews;

    if (userId) {
      const userReviewIndex = allReviews.findIndex(
        (review) => String(review.user._id) === String(userId)
      );
      if (userReviewIndex !== -1) {
        userReview = allReviews[userReviewIndex];
        // Create a new array that contains all reviews except the user's
        otherReviews = allReviews.filter(
          (review) => String(review.user._id) !== String(userId)
        );
      }
    }

    // Now, handle the pagination based on the page number
    if (page === 0) {
      // On the first page, always show the user's review first if it exists
      if (userReview) {
        reviewsToReturn.push(userReview);
      }
      // Fill the rest of the page with other reviews
      const numToSlice = pageSize - reviewsToReturn.length;
      reviewsToReturn = reviewsToReturn.concat(
        otherReviews.slice(0, numToSlice)
      );
    } else {
      // For subsequent pages, simply paginate through the 'otherReviews' list
      // The start index accounts for the items already shown on the previous pages
      const startIndex = page * pageSize - (userReview ? 1 : 0);
      const endIndex = startIndex + pageSize;

      reviewsToReturn = otherReviews.slice(startIndex, endIndex);
    }

    return NextResponse.json(
      {
        success: true,
        reviews: reviewsToReturn,
        totalReviews: totalReviews,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ GET /api/review/[productId]/review error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
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

    const { productId } = params;
    const { rating, comment } = await req.json();

    // Input validation
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }
    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be a number between 0 and 5" },
        { status: 400 }
      );
    }

    // 1. Check if the user has purchased and received this product
    const hasPurchased = await Orders.findOne({
      customer: userId,
      "items.product": productId, // Check if this product ID exists in any item
      orderStatus: "delivered", // Only allow review if order is delivered
    });

    if (!hasPurchased) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You can only review products you have purchased and received.",
        },
        { status: 403 }
      );
    }

    // 2. Check if the user has already reviewed this product
    const product = await Products.findById(productId);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const existingReview = product.reviews.find(
      (review) => String(review.user) === String(userId)
    );

    if (existingReview) {
      return NextResponse.json(
        { success: false, message: "You have already reviewed this product." },
        { status: 409 } // Conflict
      );
    }

    // 3. Fetch user details for userName and userImage
    const user = await Users.findById(userId).select(
      "firstName lastName image profilePicture name email"
    ); // Assuming 'image' is your user profile picture field

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Reviewer user not found" },
        { status: 404 }
      );
    }

    const newReview = {
      user: userId,
      rating,
      comment: comment || "",
      userName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.email ||
        user.name,
      userImage: user?.image || user?.profilePicture,
    };

    // Add the new review
    product.reviews.push(newReview);

    // Recalculate and update the overall product rating
    product.rating = calculateAverageRating(product.reviews);

    await product.save();

    return NextResponse.json(
      {
        success: true,
        message: "Review added successfully!",
        review: newReview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ POST /api/products/[productId]/reviews error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// Helper to find a review by its _id within a product's reviews array
