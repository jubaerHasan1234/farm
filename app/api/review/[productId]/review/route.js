import { auth } from "@/auth";
import { Products } from "@/model/product-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

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
    revalidatePath(`/products/${productId}`);
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
