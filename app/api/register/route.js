import { Users } from "@/model/user-modal";
import { dbConnect } from "@/service/mongo";

import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import * as fs from "fs/promises";
import path from "path";

export const POST = async (request) => {
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

  let profilePicturePath = null;
  if (profilePicture instanceof File) {
    try {
      const buffer = Buffer.from(await profilePicture.arrayBuffer());
      const filename = `${Date.now()}-${profilePicture.name}`;

      if (process.env.NODE_ENV === "development") {
        const uploadDir = path.join(process.cwd(), "public/uploads");
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, filename), buffer);
        profilePicturePath = `/uploads/${filename}`;
      } else {
        // In production, skip saving to local disk
        // Later you can replace this with Cloudinary/S3 upload
        profilePicturePath = null;
      }
    } catch (err) {
      console.error("File upload error:", err);
    }
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
    profilePicture: profilePicturePath,
  };

  try {
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
    console.error("Register API error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
