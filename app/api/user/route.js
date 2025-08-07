export const dynamic = "force-dynamic";

import { auth } from "@/auth"; // Adjust path as needed
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const session = await auth();
    console.log(session);

    if (session && session.user) {
      return NextResponse.json({ user: session.user }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error fetching user session:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
