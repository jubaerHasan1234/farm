import { generateAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  const token = cookieStore.get("refreshToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const decoded = verifyRefreshToken(token);
    const newAccessToken = generateAccessToken({ email: decoded.email });
    console.log(newAccessToken);

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}
