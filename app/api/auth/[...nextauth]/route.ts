import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import connectDB from "@/app/config/mongodbconnection";
import User from "@/app/models/user";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env["Gooogle-client_id"] || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.JWT_SECRET || process.env.AUTH_SECRET || "fallback_secret",
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: "token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  jwt: {
    encode: async ({ secret, token }) => {
      const jwtSecret = process.env.JWT_SECRET || process.env.AUTH_SECRET;
      // When token is created/updated, encode it compatible with the custom auth
      return jwt.sign({ userId: token.userId }, jwtSecret, { expiresIn: "7d" });
    },
    decode: async ({ secret, token }) => {
      const jwtSecret = process.env.JWT_SECRET || process.env.AUTH_SECRET;
      try {
        const decoded = jwt.verify(token, jwtSecret);
        return decoded; 
      } catch (e) {
        return null;
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectDB();
        
        let existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          // Generate a random password since User model requires it
          const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
          
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            password: randomPassword,
            avatar: user.image || "",
          });
        }
        
        // Pass MongoDB user ID to the jwt callback
        user.id = existingUser._id.toString();
        return true;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // On initial sign-in, user is available
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Put the MongoDB userId into the session object just in case it's used
      if (session.user) {
        session.user.id = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };