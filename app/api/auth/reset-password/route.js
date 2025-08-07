import { Users } from "@/model/user-modal";
import { dbConnect } from "@/service/mongo";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    await dbConnect();

    const user = await Users.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update only password field
    await Users.updateOne({ email }, { $set: { password: hashedPassword } });

    return NextResponse.json({ message: "Password successfully reset" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
