import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateImage } from "@/lib/openrouter";

const Schema = z.object({ projectId: z.string().min(1) });

/** Перегенерирует hero-кадр в рамках того же проекта. 1 кредит. */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ ok: false, error: "Не авторизован" }, { status: 401 });

  const { projectId } = Schema.parse(await req.json());

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, credits: true },
  });
  if (!user) return NextResponse.json({ ok: false, error: "Нет пользователя" }, { status: 404 });
  if (user.credits < 1)
    return NextResponse.json({ ok: false, error: "Недостаточно кредитов" }, { status: 402 });

  const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
  if (!project) return NextResponse.json({ ok: false, error: "Проект не найден" }, { status: 404 });

  const img = await generateImage({ prompt: project.prompt, style: project.style ?? undefined });
  const saved = await prisma.generatedImage.create({
    data: { projectId: project.id, url: img.url, prompt: project.prompt, isHero: true, approved: false },
  });

  await prisma.user.update({ where: { id: user.id }, data: { credits: { decrement: 1 } } });

  return NextResponse.json({ ok: true, image: saved, creditsLeft: user.credits - 1 });
}
