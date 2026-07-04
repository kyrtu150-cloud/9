import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateImage } from "@/lib/openrouter";
import { rateLimit, clientIp, tooMany } from "@/lib/rate-limit";

const Schema = z.object({
  mode: z.enum(["cover", "funnel", "video", "infographic"]),
  prompt: z.string().min(3).max(2000),
  style: z.string().max(80).optional(),
  aspect: z.enum(["3:4", "1:1", "9:16"]).optional().default("3:4"),
  // data-URI референса; ~4МБ файла ≈ 5.6М символов base64
  referenceImage: z
    .string()
    .startsWith("data:image/")
    .max(6_000_000)
    .optional(),
  title: z.string().max(120).optional(),
});

/** Создаёт проект и генерирует ПЕРВОЕ (hero) изображение. Стоит 1 кредит. */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ ok: false, error: "Не авторизован" }, { status: 401 });

  if (!rateLimit(`studio:${session.user.email}`, 10, 60_000)) return tooMany();
  if (!rateLimit(`studio-ip:${clientIp(req)}`, 30, 60_000)) return tooMany();

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ ok: false, error: "Проверьте данные формы" }, { status: 400 });
  const { mode, prompt, style, aspect, referenceImage, title } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, credits: true },
  });
  if (!user) return NextResponse.json({ ok: false, error: "Нет пользователя" }, { status: 404 });
  if (user.credits < 1)
    return NextResponse.json({ ok: false, error: "Недостаточно кредитов" }, { status: 402 });

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      type: mode,
      title: title || prompt.slice(0, 60),
      prompt,
      style: [style, aspect && `формат ${aspect}`].filter(Boolean).join(" · "),
      status: "draft",
    },
  });

  const img = await generateImage({
    prompt,
    style,
    aspect,
    referenceImageUrl: referenceImage,
  });

  const saved = await prisma.generatedImage.create({
    data: { projectId: project.id, url: img.url, prompt, isHero: true, approved: false },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { credits: { decrement: 1 } },
  });

  return NextResponse.json({
    ok: true,
    project: { id: project.id, type: project.type, title: project.title, prompt: project.prompt, style: project.style },
    image: saved,
    creditsLeft: user.credits - 1,
  });
}
