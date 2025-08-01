export const authConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // This runs at login
        token.user = {
          id: user.id,
          email: user.email,
          userType: user.userType, // 👈️ make sure to add this
        };
      }
      return token;
    },

    async session({ session, token }) {
      // This runs every request
      session.user = token.user;
      return session;
    },
  },
};
