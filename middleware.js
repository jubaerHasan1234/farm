import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { FARMER, LOGIN, PUBLIC_ROUTES, ROOT } from "./lib/route";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isAuthenticated = !!req.auth;
  const userType = req.auth?.user?.userType || "customer";

  const isPublicRoute =
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname === ROOT;

  const isFarmerRoute = FARMER.some((route) => pathname.startsWith(route));

  // Block unauthenticated users from private routes
  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL(LOGIN, nextUrl));
  }

  // Block customer from farmer-only routes
  if (isAuthenticated && userType === "customer" && isFarmerRoute) {
    return Response.redirect(new URL("/", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
