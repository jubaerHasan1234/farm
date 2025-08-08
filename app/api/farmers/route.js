import { Orders } from "@/model/orders-model";
import { Products } from "@/model/product-model";
import { Users } from "@/model/user-modal";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * @description API handler to fetch a summary of data and paginated user data.
 * @returns {NextResponse} A JSON response containing the requested data.
 */
export async function GET(request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse URL for pagination parameters.
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 6;

    // Calculate the number of documents to skip for user pagination
    const skip = (page - 1) * limit;

    // Use Promise.all to run all queries concurrently for better performance.
    const [
      paginatedUsers,
      userCount,
      productCount,
      farmLocations,
      customerCount,
    ] = await Promise.all([
      // Find users with pagination
      Users.find({ userType: "farmer" }).skip(skip).limit(limit),
      // Count all users with the 'farmer' userType
      Users.countDocuments({ userType: "farmer" }),
      // Count all products
      Products.countDocuments(),
      // Get a list of distinct farm locations
      Products.distinct("farmLocation"),
      // Count all unique customers from the Orders collection
      Orders.distinct("customer").then((customers) => customers.length),
    ]);

    // Calculate the count of unique farm locations from the distinct query result
    const farmLocationCount = farmLocations.length;

    // Return the consolidated data in a single JSON response
    return NextResponse.json({
      success: true,
      data: {
        paginatedUsers, // Paginated user data without order counts
        userCount, // Total count of farmers
        productCount, // Total count of products
        farmLocationCount, // Count of unique farm locations
        customerCount, // Total count of unique customers
      },
      pagination: {
        users: {
          currentPage: page,
          limit,
          totalPages: Math.ceil(userCount / limit),
        },
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
