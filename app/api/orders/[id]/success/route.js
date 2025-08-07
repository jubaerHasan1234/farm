import { generateOrderPDF } from "@/lib/generateOrderPDF";
import { sendOrderEmail } from "@/lib/sendOrderEmail";
import { Orders } from "@/model/orders-model";
import { Products } from "@/model/product-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    // 1. Fetch order with populated product details and user info

    const order = await Orders.findById(id)
      .populate("customer", "firstName lastName email")
      .populate("items.product", "productName price images unit stock")
      .lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.orderStatus === "confirmed" && order.pdf) {
      return NextResponse.json({
        success: true,
        message: "Order already confirmed and PDF retrieved.",
        pdfBase64: order.pdf,
      });
    }

    // 2. Reduce stock for each item in the order
    const stockUpdatePromises = order.items.map(async (item) => {
      if (item.product && item.product._id) {
        if (item.product.stock < item.quantity) {
          console.error(
            `Insufficient stock for product ${item.product.productName}. Required: ${item.quantity}, Available: ${item.product.stock}`
          );
          throw new Error(
            `Insufficient stock for ${item.product.productName}. Please check inventory.`
          );
        }

        await Products.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity }, // Decrement stock
        });
      } else {
        console.warn(
          `Product reference missing or not populated for item in order ${id}`
        );
      }
    });

    await Promise.all(stockUpdatePromises);

    // 3. Generate PDF
    const company = {
      name: "Fresh Farm Co.",
      email: "contact@freshfarm.com",
      phone: "+880-1234567890",
      address: "Dhaka, Bangladesh",
    };

    const pdfBuffer = await generateOrderPDF({
      user: order.customer,
      order: order,
      company: company,
    });

    const base64PDF = pdfBuffer.toString("base64");

    const updatedOrder = await Orders.findByIdAndUpdate(
      id,
      {
        orderStatus: "confirmed",
        pdf: base64PDF,
        paymentStatus: "paid",
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update order status or save PDF",
        },
        { status: 500 }
      );
    }

    // 5. Send email (only if user email exists)
    if (order.customer && order.customer.email) {
      await sendOrderEmail({
        to: order.customer.email,
        pdfBuffer: pdfBuffer,
      });
    } else {
      console.warn(
        `No email found for customer ${order.customer?._id} for order ${id}. Skipping email.`
      );
    }

    // 6. Send PDF to frontend
    return NextResponse.json({
      success: true,
      message: "Order confirmed, your invoice has been sent to your email.",
      pdfBase64: base64PDF,
      orderId: id,
    });
  } catch (err) {
    console.error("❌ Order success error:", err);
    let errorMessage = "Internal Server Error";
    let statusCode = 500;

    if (err.message.includes("Insufficient stock")) {
      errorMessage = err.message;
      statusCode = 409;
    } else if (err.message.includes("Font file not found")) {
      errorMessage =
        "PDF generation failed due to missing font. Please contact support.";
      statusCode = 500;
    }

    return NextResponse.json(
      { success: false, message: errorMessage, details: err.message },
      { status: statusCode }
    );
  }
}
