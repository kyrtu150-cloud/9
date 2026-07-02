import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.redirect(new URL("/auth/login", req.url));
  const form = await req.formData();
  const subject = (form.get("subject") ?? "").toString().slice(0, 120);
  const message = (form.get("message") ?? "").toString().slice(0, 2000);
  if (!subject || !message) return NextResponse.redirect(new URL("/app/support?err=1", req.url));

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.redirect(new URL("/auth/login", req.url));
  await prisma.ticket.create({ data: { userId: user.id, subject, message } });
  return NextResponse.redirect(new URL("/app/support", req.url));
}
