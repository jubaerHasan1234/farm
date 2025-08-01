// "use server";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import { authConfig } from "./auth.config";
import { getBaseUrl } from "./lib/getBaseUrl";
import { generateAccessToken, generateRefreshToken } from "./lib/jwt";
import { Users } from "./model/user-modal";
import { dbConnect } from "./service/mongo";

/* refresh token start  */
async function refreshAccessToken(token) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens?.access_token,
      accessTokenExpires: Date.now() + refreshedTokens?.expires_in * 1000,
      refreshToken: refreshedTokens?.refresh_token,
    };
  } catch (error) {
    console.error(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
/* refresh token end */

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (credentials == null) return null;
        await dbConnect();
        try {
          const user = await Users.findOne({ email: credentials?.email });

          if (user) {
            const isMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isMatch) {
              // ✅ Token payload (minimal, avoid sensitive fields)
              const payload = {
                id: user._id.toString(),
                email: user.email,
                userType: user.userType,
              };

              // ✅ Generate tokens
              const accessToken = generateAccessToken(payload);
              const refreshToken = generateRefreshToken(payload);
              // ✅ Set refreshToken as HttpOnly cookie here directly using `cookies()` (App Router only)
              cookies().set({
                name: "refreshToken",
                value: refreshToken,
                httpOnly: true,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60,
              });
              // ✅ Return user + tokens (this goes to jwt() callback)

              return {
                id: user._id.toString(),
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                userType: user.userType,
                phone: user.phone,
                address: user.address,
                profilePicture: user.profilePicture,
                bio: user.bio,
                accessToken,
                refreshToken,
              };
            } else {
              console.error("password mismatch");
              throw new Error("Check your password");
            }
          } else {
            console.error("User not found");
            throw new Error("User not found");
          }
        } catch (err) {
          console.error(err);
          throw new Error(err);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      const isInitialLogin = !!account;

      if (isInitialLogin) {
        token.provider = account.provider;

        // Google login
        if (account.provider === "google") {
          return {
            accessToken: account.access_token,
            accessTokenExpires: Date.now() + account.expires_in * 1000,
            refreshToken: account.refresh_token,
            user,
            provider: "google",
          };
        }

        // Credentials login
        if (account.provider === "credentials") {
          return {
            accessToken: user.accessToken, // coming from your /api/login
            accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 mins
            refreshToken: user.refreshToken, // optional if you're using cookie
            user,
            provider: "credentials",
          };
        }
      }

      // Token still valid
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // 🔄 Refresh for Google
      if (token.provider === "google") {
        console.log("new refresh token");
        return await refreshAccessToken(token);
      }

      // 🔄 Refresh for Credentials (call your /api/refresh API)
      if (token.provider === "credentials") {
        try {
          const res = await fetch(`${getBaseUrl()}/api/refresh`, {
            method: "POST",
            credentials: "include", // to send HTTP-only cookie
          });

          if (!res.ok) {
            const error = await res.json();
            console.error("Refresh failed:", error);
            throw new Error(error.error || "Refresh failed");
          }
          console.log("new refresh token");

          const data = await res.json();
          console.log(res);

          return {
            ...token,
            accessToken: data.accessToken,
            accessTokenExpires: Date.now() + 15 * 60 * 1000,
          };
        } catch (err) {
          console.error("Credential refresh error:", err);
          return { ...token, error: "CredentialRefreshError" };
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
});
