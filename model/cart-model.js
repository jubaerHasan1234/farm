import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      enum: ["kg", "lbs", "piece", "liter", "dozen", "bundle"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
