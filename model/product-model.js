import mongoose from "mongoose";

// Review sub-schema for each review
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userImage: {
      type: String,
      required: true,
      trim: true,
      default: "https://placehold.co/80x80/e0e0e0/000000?text=User",
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["vegetables", "fruits", "grains", "dairy", "herbs", "honey"],
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "lbs", "piece", "liter", "dozen", "bundle"],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length >= 1 && arr.length <= 5;
        },
        message: "You must upload between 1 and 5 images.",
      },
    },
    farmLocation: {
      type: String,
      required: true,
    },
    harvestDate: {
      type: Date,
    },
    features: {
      type: [String],
      enum: [
        "organic",
        "pesticide-free",
        "fresh",
        "non-gmo",
        "local",
        "sustainable",
        "fair-trade",
        "gluten-free",
      ],
      default: [],
    },

    activeStatus: {
      type: Boolean,
      default: true,
    },

    // Add overall average rating
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
    },

    // Add embedded reviews
    reviews: [reviewSchema],

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

export const Products =
  mongoose.models.Products || mongoose.model("Products", productSchema);
