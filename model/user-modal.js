import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },

  userId: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  password: {
    required: true,
    type: String,
  },
  email: {
    required: true,
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
  },
  address: {
    required: false,
    type: String,
  },
  profilePicture: {
    required: false,
    type: String,
  },
});

export const Users =
  mongoose.models.Users ?? mongoose.model("Users", userSchema);
