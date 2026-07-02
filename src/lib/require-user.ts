import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

/**
 * Гарантирует наличие сессии и пользователя в БД.
 * При отсутствии — редиректит на логин вместо падения с TypeError.
 */
export async function requireUser<T extends Record<string, any> = {}>(query?: T) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/login?callbackUrl=/app");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    ...(query as any),
  });
  if (!user) redirect("/auth/login?callbackUrl=/app");

  return { session, user: user as any };
}
