import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.redirect(new URL("/auth/login", req.url));
  const form = await req.formData();
  const name = (form.get("name") ?? "").toString().slice(0, 80);
  await prisma.user.update({ where: { email: session.user.email }, data: { name } });
  return NextResponse.redirect(new URL("/app/settings", req.url));
}
