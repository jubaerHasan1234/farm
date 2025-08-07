import { Products } from "@/model/product-model";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;

    // --- Pagination Parameters ---
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);
    const skip = (page - 1) * limit;

    // --- Filtering Logic ---
    let query = {};
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const priceRange = searchParams.get("priceRange");
    const location = searchParams.get("location");
    const organic = searchParams.get("organic");

    // Search by productName or description (case-insensitive)
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category.toLowerCase(); // Convert to lowercase for the query
    }

    // Parse the priceRange parameter and apply the filter
    if (priceRange) {
      query.price = {};
      if (priceRange === "Under ৳30") {
        query.price.$lte = 30;
      } else if (priceRange === "৳30 - ৳50") {
        query.price.$gte = 30;
        query.price.$lte = 50;
      } else if (priceRange === "৳50 - ৳100") {
        query.price.$gte = 50;
        query.price.$lte = 100;
      } else if (priceRange === "Over ৳100") {
        query.price.$gte = 100;
      }
    }

    // Filter by location
    if (location && location !== "All Locations") {
      query.location = location;
    }

    // Filter by 'organic' feature
    if (organic === "true") {
      query.features = "organic";
    }

    // --- Sorting Logic ---
    let sort = {};
    const sortParam = searchParams.get("sort");

    // Parse the sort parameter and apply the correct sorting
    if (sortParam) {
      if (sortParam === "Newest First") {
        sort.createdAt = -1;
      } else if (sortParam === "Price: Low to High") {
        sort.price = 1;
      } else if (sortParam === "Price: High to Low") {
        sort.price = -1;
      } else if (sortParam === "Rating") {
        sort.rating = -1;
      }
    }

    // Default sort if no other sort options are provided
    if (Object.keys(sort).length === 0) {
      sort.createdAt = -1;
    }

    // --- Pagination and Count Logic ---
    const totalProducts = await Products.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    // Use the Mongoose model to find, sort, skip, and limit products
    const products = await Products.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Return the paginated data along with total pages
    return NextResponse.json({
      success: true,
      data: products,
      currentPage: page,
      totalPages: totalPages,
      totalProducts: totalProducts,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
