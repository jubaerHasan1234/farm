import { auth } from "@/auth"; // your auth function, adjust if needed
import { Favorite } from "@/model/favorites-model";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";

export async function GET(req) {
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

    // Get all favorites for logged-in user
    const favorites = await Favorite.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, favorites });
  } catch (error) {
    console.error("Favorite GET error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
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

    const body = await req.json();
    const {
      productId,
      productName,
      image,
      unit,
      price,
      stock,
      reviews = 0,
      rating = 0,
    } = body;

    if (
      !productId ||
      !productName ||
      !image ||
      !unit ||
      price == null ||
      stock == null
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Ensure reviews and rating are numbers, never arrays or other types
    const parsedReviews = Array.isArray(reviews) ? 0 : Number(reviews) || 0;
    const parsedRating = Array.isArray(rating) ? 0 : Number(rating) || 0;

    // Check if already favorited
    const existing = await Favorite.findOne({ productId, createdBy: userId });

    if (existing) {
      existing.reviews = parsedReviews;
      existing.rating = parsedRating;
      await existing.save();
      return NextResponse.json({ success: true, favorite: existing });
    }

    const favorite = await Favorite.create({
      productId,
      productName,
      image,
      unit,
      price,
      stock,
      createdBy: userId,
      reviews: parsedReviews,
      rating: parsedRating,
    });

    return NextResponse.json({ success: true, favorite });
  } catch (error) {
    console.error("Favorite POST error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
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

    const body = await req.json(); // 🛠️ important for DELETE
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "ProductId is required" },
        { status: 400 }
      );
    }

    const deleted = await Favorite.findOneAndDelete({
      productId,
      createdBy: userId,
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Favorite DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
