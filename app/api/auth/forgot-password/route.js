import { Users } from "@/model/user-modal";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { email } = await req.json();
  await dbConnect();

  const user = await Users.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "Email not found" }, { status: 404 });
  }

  // Basic reset URL (no token)
  const resetUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/reset-password?email=${encodeURIComponent(email)}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Reset your password",
    html: `<p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
  });

  return NextResponse.json({ message: "Reset link sent to your email" });
}
