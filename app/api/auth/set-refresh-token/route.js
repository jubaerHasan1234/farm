import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Missing refreshToken" });
  }

  const cookie = serialize("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  res.setHeader("Set-Cookie", cookie);
  res.status(200).json({ success: true });
}
