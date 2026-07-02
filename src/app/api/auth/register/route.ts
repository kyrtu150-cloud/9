import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const Schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(72),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = Schema.parse(body);
    const lower = email.toLowerCase();

    const exists = await prisma.user.findUnique({ where: { email: lower } });
    if (exists) {
      return NextResponse.json({ ok: false, error: "Этот email уже зарегистрирован" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name,
        email: lower,
        password: hash,
        credits: 10,
        emailVerified: new Date(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
