import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    // ✅ Just store the number of reviews
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Optional: average rating if you want to display stars
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Favorite =
  mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);
