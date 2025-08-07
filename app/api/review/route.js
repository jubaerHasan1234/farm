// import { auth } from "@/lib/auth"; // Assuming you have a function to get the current user session
// import dbConnect from "@/lib/dbConnect"; // Assuming you have a database connection utility
// import Products from "@/models/Products"; // Assuming you have a Mongoose Products model
// import mongoose from "mongoose";
// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//   try {
//     await dbConnect();

//     // Get the product ID from the URL parameters
//     const { productId } = params;

//     // Get the user session to identify the logged-in user
//     const session = await auth();
//     const userId = session?.user?.id;

//     // Validate the provided productId
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return NextResponse.json(
//         { success: false, message: "Invalid product ID" },
//         { status: 400 }
//       );
//     }

//     // Find the product by ID and select only the reviews
//     const product = await Products.findById(productId).select("reviews");

//     if (!product) {
//       return NextResponse.json(
//         { success: false, message: "Product not found" },
//         { status: 404 }
//       );
//     }

//     const allReviews = product.reviews || [];
//     let prioritizedReviews = [];

//     if (userId) {
//       // Find the logged-in user's review
//       const userReviewIndex = allReviews.findIndex(
//         (review) => String(review.user) === String(userId)
//       );

//       // If the user has a review, remove it from the main list and add it to the front
//       if (userReviewIndex !== -1) {
//         const userReview = allReviews.splice(userReviewIndex, 1);
//         prioritizedReviews = [...userReview];
//       }
//     }

//     // Combine the user's review (if found) with the other reviews.
//     // We limit the rest of the reviews to ensure a total of 5.
//     const remainingReviewsCount = 5 - prioritizedReviews.length;
//     const remainingReviews = allReviews.slice(0, remainingReviewsCount);

//     // Concatenate the two lists to get the final result
//     const finalReviews = [...prioritizedReviews, ...remainingReviews];

//     return NextResponse.json(
//       {
//         success: true,
//         reviews: finalReviews,
//         totalReviews: product.reviews?.length || 0,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("❌ GET /api/products/[productId]/reviews error:", error);
//     return NextResponse.json(
//       { success: false, message: "Server error" },
//       { status: 500 }
//     );
//   }
// }
