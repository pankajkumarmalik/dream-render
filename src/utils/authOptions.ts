import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session }) {
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email || "" },
      });

      if (user) {
        session.user = {
          ...user,
        };
      }

      return session;
    },
  },
};
