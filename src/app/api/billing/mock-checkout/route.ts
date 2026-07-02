import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PLAN_TO_PRICE: Record<string, { amount: number; credits: number }> = {
  start: { amount: 199000, credits: 50 },
  pro: { amount: 499000, credits: 200 },
  business: { amount: 1299000, credits: 800 },
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.redirect(new URL("/auth/login", req.url));

  const form = await req.formData();
  const plan = form.get("plan")?.toString();
  const credits = Number(form.get("credits") ?? 0);
  const priceRub = Number(form.get("price") ?? 0);

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.redirect(new URL("/app/billing", req.url));

  // Mock: сразу проставляем тариф / зачисляем кредиты
  if (plan && PLAN_TO_PRICE[plan]) {
    const { amount, credits: planCredits } = PLAN_TO_PRICE[plan];
    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan,
        credits: { increment: planCredits },
        planRenewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    await prisma.transaction.create({
      data: { userId: user.id, kind: "subscription", amount, credits: planCredits, status: "paid", meta: JSON.stringify({ plan }) },
    });
  } else if (credits > 0 && priceRub > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { increment: credits } },
    });
    await prisma.transaction.create({
      data: { userId: user.id, kind: "credits", amount: priceRub * 100, credits, status: "paid" },
    });
  }

  return NextResponse.redirect(new URL("/app/billing", req.url));
}
