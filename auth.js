import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import mongoClientPromise from "./database/mongoClientPromise";
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
  adapter: MongoDBAdapter(mongoClientPromise, {
    databaseName: process.env.ENVIRONMENT,
  }),
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (credentials == null) return null;
        await dbConnect();
        try {
          const user = await Users.findOne({
            email: credentials?.email,
          }).lean();

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

              // ✅ Return user + tokens (this goes to jwt() callback)

              return {
                id: user._id.toString(),
                email: user.email,
                name:
                  user.firstName || user.lastName
                    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                    : user.name ?? "Unknown User",
                userType: user.userType || "customer",
                phone: user.phone ?? "",
                address: user.address ?? "",
                profilePicture: user.profilePicture ?? user.image ?? "",
                bio: user.bio ?? "",
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
            provider: "google",
            user: {
              id: user.id,
              email: user.email,
              name: user.name || "Google User",
              userType: user?.userType || "customer", // default
              profilePicture: user?.image || "",
              address: user?.address || "",
              bio: user?.bio || "",
              phone: user?.phone || "",
            },
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
        return await refreshAccessToken(token);
      }

      // 🔄 Refresh for Credentials (call your /api/refresh API)
      if (token.provider === "credentials") {
        try {
          const res = await fetch(`${getBaseUrl()}/api/refresh`, {
            method: "POST",
            credentials: "include", // to send HTTP-only cookie
            body: JSON.stringify({
              token: token.refreshToken,
            }),
          });

          if (!res.ok) {
            const error = await res.json();
            console.error("Refresh failed:", error);
            throw new Error(error.error || "Refresh failed");
          }

          const data = await res.json();

          return {
            ...token,
            accessToken: data.accessToken,
            accessTokenExpires: Date.now() + 15 * 60 * 1000,
            refreshToken: data.refreshToken,
          };
        } catch (err) {
          console.error("Credential refresh error:", err);
          return { ...token, error: "CredentialRefreshError" };
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.user?.id || null,
        name: token.user?.name || "Unknown User",
        email: token.user?.email,
        userType: token.user?.userType || "customer",
        profilePicture: token.user?.profilePicture || "",
        phone: token.user?.phone || "",
        address: token.user?.address || "",
        bio: token.user?.bio || "",
      };
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
});
