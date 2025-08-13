import { Products } from "@/model/product-model"; // Adjust the path as needed
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
// A constant list of your product categories
const ALL_CATEGORIES = [
  "vegetables",
  "fruits",
  "grains",
  "dairy",
  "herbs",
  "honey",
];

export async function GET() {
  try {
    await dbConnect();

    // Use Mongoose's aggregation pipeline to group by category and count documents
    const categoryCounts = await Products.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // Create a map for quick lookup of counts from the aggregation result
    const countsMap = new Map(
      categoryCounts.map((item) => [item._id, item.count])
    );

    // Format the final array to include all categories, even those with a count of 0
    const formattedCounts = ALL_CATEGORIES.map((category) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      count: countsMap.get(category) || 0,
    }));

    return NextResponse.json({ success: true, data: formattedCounts });
  } catch (error) {
    console.error("Failed to fetch category counts:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
