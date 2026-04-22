import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const providers = [] as AuthOptions["providers"];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  );
}

if (process.env.APPLE_ID && process.env.APPLE_CLIENT_SECRET) {
  providers.push(
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET
    })
  );
}

providers.push(
  CredentialsProvider({
    name: "Email + Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      const parsed = credentialsSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email }
      });

      if (!user?.passwordHash) return null;

      const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
    }
  })
);

export const authOptions: AuthOptions = {
  ...(process.env.DATABASE_URL ? { adapter: PrismaAdapter(prisma) } : {}),
  providers,
  session: {
    strategy: process.env.DATABASE_URL ? "database" : "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user.role as Role) || Role.ATHLETE;
      }
      return token;
    },
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = user?.id || token?.sub || "";
        session.user.role = (user?.role as Role) || (token?.role as Role) || Role.ATHLETE;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin"
  }
};
