import { Users } from "@/model/user-modal";
import { dbConnect } from "@/service/mongo";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (request) => {
  try {
    const formData = await request.formData();

    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");
    const userType = formData.get("userType");
    const phone = formData.get("phone");
    const bio = formData.get("bio");
    const address = formData.get("address");
    const profilePicture = formData.get("profilePicture");

    let profilePictureUrl = null;
    if (profilePicture instanceof File) {
      // Read the file as a buffer
      const buffer = Buffer.from(await profilePicture.arrayBuffer());
      // Convert the buffer to a base64 string
      const base64Image = buffer.toString("base64");
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:${profilePicture.type};base64,${base64Image}`,
        {
          folder: "profile_pictures", // Optional: organize uploads in a folder
        }
      );
      profilePictureUrl = result.secure_url;
    }

    await dbConnect();

    // Check if user with this email already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({
          message: "your account already created please sign in",
        }),
        {
          status: 409, // Conflict status code
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
      phone,
      bio,
      address,
      profilePicture: profilePictureUrl,
    };

    const createdUser = await Users.create(newUser);
    return new NextResponse(
      JSON.stringify({
        message: "Your account has been created",
        id: createdUser.id,
      }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    // Ensure the error response is always JSON
    return new NextResponse(
      JSON.stringify({
        message: "Server returned an unexpected error format.",
        error: error.message,
      }),
      {
        status: 500,
      }
    );
  }
};
