// app/api/related/route.js

import { Products } from "@/model/product-model";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const feature = searchParams.get("feature");
  const currentProductId = searchParams.get("productId");

  if (!feature || !currentProductId) {
    console.error("[API RELATED] Missing required parameters. Returning 400.");
    return NextResponse.json(
      { error: "Feature and productId query parameters are required." },
      { status: 400 }
    );
  }

  // Connect to the database.
  try {
    await dbConnect();

    const lowercaseFeature = feature.toLowerCase();

    const similarProducts = await Products.find({
      features: lowercaseFeature,
      _id: { $ne: currentProductId }, // $ne operator means 'not equal'
    }).limit(4);

    return NextResponse.json(similarProducts);
  } catch (error) {
    console.error("[API RELATED] DATABASE ERROR:", error.message);
    console.error("[API RELATED] Stack Trace:", error.stack);
    return NextResponse.json(
      { error: "Failed to fetch similar products." },
      { status: 500 }
    );
  }
}
