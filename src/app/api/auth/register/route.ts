import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientIp, tooMany } from "@/lib/rate-limit";

const Schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(200),
  password: z.string().min(8).max(72),
});

export async function POST(req: Request) {
  if (!rateLimit(`register:${clientIp(req)}`, 5, 60_000)) return tooMany();

  try {
    const parsed = Schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Проверьте данные: имя от 2 символов, корректный email, пароль от 8 символов" },
        { status: 400 }
      );
    }
    const { name, email, password } = parsed.data;
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
  } catch {
    // Не раскрываем внутренности ошибок наружу
    return NextResponse.json({ ok: false, error: "Ошибка регистрации. Попробуйте позже." }, { status: 500 });
  }
}
