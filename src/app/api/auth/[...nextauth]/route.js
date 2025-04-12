import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/libs/mongoDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const handler = NextAuth({
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Tài khoản thông thường
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ username: credentials.username });
        if (!user) throw new Error("Tài khoản không tồn tại");

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isMatch) throw new Error("Sai mật khẩu");

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.username,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Khi user đăng nhập
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        await connectDB();

        const existingUser = await User.findOne({ username: profile.email });

        if (!existingUser) {
          const randomPassword = crypto.randomBytes(16).toString("hex");
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          await User.create({
            username: profile.email,
            password: hashedPassword,
            fullName: profile.name,
            provider: "google",
          });
        }
      }

      return true;
    },

    // Gắn dữ liệu vào token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
      }
      return token;
    },

    // Gắn dữ liệu vào session
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
