import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import YandexProvider from "next-auth/providers/yandex";
import VkProvider from "next-auth/providers/vk";
import EmailProvider from "next-auth/providers/email";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    newUser: "/app",
  },
  providers: [
    CredentialsProvider({
      name: "Email + пароль",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!user || !user.password) return null;
        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
    ...(process.env.YANDEX_CLIENT_ID && process.env.YANDEX_CLIENT_SECRET
      ? [
          YandexProvider({
            clientId: process.env.YANDEX_CLIENT_ID,
            clientSecret: process.env.YANDEX_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.VK_CLIENT_ID && process.env.VK_CLIENT_SECRET
      ? [
          VkProvider({
            clientId: process.env.VK_CLIENT_ID,
            clientSecret: process.env.VK_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.EMAIL_SERVER_HOST && process.env.EMAIL_FROM
      ? [
          EmailProvider({
            server: {
              host: process.env.EMAIL_SERVER_HOST,
              port: Number(process.env.EMAIL_SERVER_PORT || 465),
              auth: {
                user: process.env.EMAIL_SERVER_USER!,
                pass: process.env.EMAIL_SERVER_PASSWORD!,
              },
            },
            from: process.env.EMAIL_FROM,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      if (token.email) {
        const fresh = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, credits: true, plan: true },
        });
        if (fresh) {
          token.id = fresh.id;
          token.role = fresh.role;
          token.credits = fresh.credits;
          token.plan = fresh.plan;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role ?? "user";
        (session.user as any).credits = token.credits ?? 0;
        (session.user as any).plan = token.plan ?? "free";
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Каждому новому пользователю — 10 стартовых кредитов
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { credits: 10 },
        });
      }
    },
  },
};
