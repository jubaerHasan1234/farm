import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String, // Used by Auth.js / Google
    },
    firstName: {
      required: false,
      type: String,
    },
    lastName: {
      required: false,
      type: String,
    },
    password: {
      required: false, // Must be optional for Google OAuth users
      type: String,
    },
    email: {
      required: true,
      unique: true,
      type: String,
    },
    phone: {
      required: false,
      type: String,
    },
    bio: {
      required: false,
      type: String,
    },
    userType: {
      required: true,
      type: String,
      enum: ["customer", "farmer"],
      default: "customer", // Default role for Google OAuth users
    },
    address: {
      required: false,
      type: String,
    },
    profilePicture: {
      required: false,
      type: String,
    },
    image: {
      type: String, // Profile picture from Google OAuth
    },
    emailVerified: {
      type: Date, // Required by Auth.js
    },
  },
  { timestamps: true }
);

export const Users =
  mongoose.models.Users ?? mongoose.model("Users", userSchema);