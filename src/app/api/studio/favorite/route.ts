import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, tooMany } from "@/lib/rate-limit";

const Schema = z.object({ imageId: z.string().min(1).max(64) });

/** Переключает флаг «избранное» на кадре пользователя. */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ ok: false, error: "Не авторизован" }, { status: 401 });
  if (!rateLimit(`fav:${session.user.email}`, 60, 60_000)) return tooMany();

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ ok: false, error: "Проверьте данные" }, { status: 400 });

  const image = await prisma.generatedImage.findFirst({
    where: { id: parsed.data.imageId, project: { user: { email: session.user.email } } },
  });
  if (!image) return NextResponse.json({ ok: false, error: "Кадр не найден" }, { status: 404 });

  const updated = await prisma.generatedImage.update({
    where: { id: image.id },
    data: { approved: !image.approved },
  });
  return NextResponse.json({ ok: true, approved: updated.approved });
}
