import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateBatch } from "@/lib/openrouter";

const Schema = z.object({
  projectId: z.string().min(1),
  heroImageId: z.string().min(1),
});

const BATCH_PROMPTS: Record<string, string[]> = {
  funnel: [
    "front shot, head-on, sharp focus, full body in frame, same outfit and lighting as reference",
    "three-quarter angle from the left, same outfit",
    "three-quarter angle from the right, same outfit",
    "back shot, same outfit",
    "side profile, same outfit",
    "close-up macro of the product detail",
    "lifestyle context shot, same vibe",
    "dynamic pose with movement, same vibe",
    "low angle dramatic shot",
    "high angle flat-lay style",
    "Pinterest-style mood frame",
    "catalog clean white background",
    "imagine brand campaign poster style",
    "social media square crop variant",
  ],
  cover: [
    "alternative composition, same product",
    "different background mood",
    "vibrant color burst variation",
    "minimalist monochrome variation",
    "with subtle lifestyle props",
    "dynamic movement frozen",
    "studio softbox lighting variant",
    "golden hour outdoor variant",
    "high-contrast moody variant",
  ],
  video: [
    "second frame variant",
    "third frame variant",
    "fourth frame variant",
  ],
  infographic: [
    "alternative layout with feature callouts",
    "comparison split layout",
  ],
};

/** Догенерирует остальную серию по утверждённому hero-кадру. */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ ok: false, error: "Не авторизован" }, { status: 401 });

  const { projectId, heroImageId } = Schema.parse(await req.json());

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, credits: true },
  });
  if (!user) return NextResponse.json({ ok: false, error: "Нет пользователя" }, { status: 404 });

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
    include: { images: true },
  });
  if (!project) return NextResponse.json({ ok: false, error: "Проект не найден" }, { status: 404 });

  const hero = project.images.find((i) => i.id === heroImageId);
  if (!hero) return NextResponse.json({ ok: false, error: "Hero-кадр не найден" }, { status: 404 });

  const variants = BATCH_PROMPTS[project.type] ?? BATCH_PROMPTS.funnel;
  const cost = variants.length;
  if (user.credits < cost)
    return NextResponse.json(
      { ok: false, error: `Нужно ${cost} кредитов, доступно ${user.credits}` },
      { status: 402 }
    );

  // Помечаем hero approved, помечаем проект как full
  await prisma.generatedImage.update({
    where: { id: hero.id },
    data: { approved: true },
  });

  // Параллельная генерация
  const results = await Promise.all(
    variants.map((variantPrompt, i) =>
      import("@/lib/openrouter").then(({ generateImage }) =>
        generateImage({
          prompt: `${project.prompt}. Variation #${i + 1}: ${variantPrompt}`,
          style: project.style ?? undefined,
          referenceImageUrl: hero.url,
          variantSeed: i + 100,
        })
      )
    )
  );

  const created = await prisma.$transaction([
    ...results.map((r, i) =>
      prisma.generatedImage.create({
        data: {
          projectId: project.id,
          url: r.url,
          prompt: `${project.prompt} (variant ${i + 1})`,
          variant: i + 1,
          isHero: false,
          approved: false,
        },
      })
    ),
    prisma.project.update({
      where: { id: project.id },
      data: { status: "full", heroImageId: hero.id },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: cost } },
    }),
  ]);

  // Last item in transaction is the user update — but we want images
  const images = created.slice(0, results.length);
  return NextResponse.json({
    ok: true,
    images,
    creditsLeft: user.credits - cost,
  });
}
