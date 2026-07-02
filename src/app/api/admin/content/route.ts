import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "admin") return null;
  return user;
}

const Schema = z.object({ key: z.string().min(1), value: z.string().max(5000) });

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "Доступ запрещён" }, { status: 403 });

  const { key, value } = Schema.parse(await req.json());
  await prisma.contentBlock.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return NextResponse.json({ ok: true });
}
