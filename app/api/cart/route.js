import { auth } from "@/auth"; // if using NextAuth or custom auth
import { Cart } from "@/model/cart-model";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const { productId, productName, image, unit, price, stock, quantity } =
      body;

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (
      !productId ||
      !productName ||
      !image ||
      !unit ||
      !price ||
      !stock ||
      !quantity
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Optional: Check if item is already in cart
    const existing = await Cart.findOne({
      productId,
      createdBy: userId,
    });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return NextResponse.json({ success: true, cart: existing });
    }

    const cart = await Cart.create({
      productId,
      productName,
      image,
      unit,
      price,
      stock,
      quantity,
      createdBy: userId,
    });

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error("❌ Cart POST error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
// ## DELETE Handler (Updated for single or multiple deletions)
// ---
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

    const body = await req.json();
    const { productId } = body; // This can be a string or an array of strings

    if (!productId || (Array.isArray(productId) && productId.length === 0)) {
      return NextResponse.json(
        { success: false, message: "productId(s) are required" },
        { status: 400 }
      );
    }

    let deletedCount = 0;
    let message = "";

    if (Array.isArray(productId)) {
      // Delete multiple items
      const deleteResult = await Cart.deleteMany({
        productId: { $in: productId }, // Use $in operator for multiple IDs
        createdBy: userId,
      });
      deletedCount = deleteResult.deletedCount;
      message = `${deletedCount} item(s) removed from cart`;
    } else {
      // Delete a single item
      const deletedItem = await Cart.findOneAndDelete({
        productId,
        createdBy: userId,
      });
      if (deletedItem) {
        deletedCount = 1;
        message = "Item removed from cart";
      } else {
        return NextResponse.json(
          { success: false, message: "Item not found in cart" },
          { status: 404 }
        );
      }
    }

    if (deletedCount === 0) {
      // This case would be hit if productId was an array but no matching items were found
      return NextResponse.json(
        { success: false, message: "No items found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: message,
      deletedCount: deletedCount, // Provide count for multiple deletions
    });
  } catch (error) {
    console.error("❌ Cart DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
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

    const cartItems = await Cart.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, cart: cartItems });
  } catch (error) {
    console.error("❌ Cart GET error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
// put handler
export async function PUT(req) {
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
    const { productId, quantity } = body;

    // Validate incoming data
    if (!productId || typeof quantity !== "number" || quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid productId or quantity" },
        { status: 400 }
      );
    }

    // Find the cart item and update its quantity
    const updatedCartItem = await Cart.findOneAndUpdate(
      { productId, createdBy: userId },
      { quantity: quantity },
      { new: true } // Return the updated document
    );

    if (!updatedCartItem) {
      return NextResponse.json(
        { success: false, message: "Cart item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cart item quantity updated",
      cart: updatedCartItem,
    });
  } catch (error) {
    console.error("❌ Cart PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
