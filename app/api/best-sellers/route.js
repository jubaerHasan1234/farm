export const dynamic = "force-dynamic";

import { Orders } from "@/model/orders-model";
import { Products } from "@/model/product-model";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const orders = await Orders.find();

    // ✅ Get all active products first
    const activeProducts = await Products.find({ activeStatus: true });
    const activeProductIds = new Set(
      activeProducts.map((p) => p._id.toString())
    );

    // ✅ If no orders → return first-created active products
    if (orders.length === 0) {
      const total = activeProducts.length;
      const paginated = activeProducts
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .slice(skip, skip + limit);

      return NextResponse.json({
        success: true,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        bestSellers: paginated.map((p) => ({
          ...p.toObject(),
          soldCount: 0,
          isFirstTime: true,
        })),
        message: "No orders yet. Showing first created products.",
      });
    }

    // ✅ Orders exist → calculate sales for only active products
    const productSales = new Map();
    for (const order of orders) {
      for (const item of order.items) {
        const productId = item.product.toString();
        if (!activeProductIds.has(productId)) continue; // skip inactive

        productSales.set(
          productId,
          (productSales.get(productId) || 0) + item.quantity
        );
      }
    }

    // ✅ Map active products with sales data and sort
    const allSorted = activeProducts
      .map((p) => {
        const sold = productSales.get(p._id.toString()) || 0;
        return {
          ...p.toObject(),
          soldCount: sold,
          isFirstTime: false,
        };
      })
      .sort(
        (a, b) =>
          b.soldCount - a.soldCount ||
          new Date(a.createdAt) - new Date(b.createdAt)
      );

    const total = allSorted.length;
    const paginated = allSorted.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      bestSellers: paginated,
    });
  } catch (err) {
    console.error("❌ Best seller fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
