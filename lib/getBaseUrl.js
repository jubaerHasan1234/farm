export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // Client-side: use relative path
  return process.env.NEXT_PUBLIC_BASE_URL;
}
