import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.redirect(new URL("/auth/login", req.url));
  const form = await req.formData();
  const current = (form.get("current") ?? "").toString();
  const next = (form.get("next") ?? "").toString();
  if (next.length < 6) return NextResponse.redirect(new URL("/app/settings?err=short", req.url));

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user?.password) return NextResponse.redirect(new URL("/app/settings?err=oauth", req.url));
  const ok = await bcrypt.compare(current, user.password);
  if (!ok) return NextResponse.redirect(new URL("/app/settings?err=bad", req.url));
  const hash = await bcrypt.hash(next, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: hash } });
  return NextResponse.redirect(new URL("/app/settings?ok=1", req.url));
}
