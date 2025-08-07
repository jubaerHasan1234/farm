import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/lib/jwt";

import { NextResponse } from "next/server";

export async function POST(req) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const decoded = verifyRefreshToken(token);
    const newAccessToken = generateAccessToken({ email: decoded.email });
    const newRefreshToken = generateRefreshToken({ email: decoded.email });

    return NextResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}
