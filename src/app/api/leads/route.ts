import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, clientIp, tooMany } from "@/lib/rate-limit";

const Schema = z.object({
  name: z.string().min(2).max(100),
  contact: z.string().min(3).max(200),
  message: z.string().max(2000).optional().default(""),
  // honeypot: боты заполняют скрытое поле — люди нет
  website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  if (!rateLimit(`leads:${clientIp(req)}`, 5, 60_000)) return tooMany();

  try {
    const parsed = Schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Проверьте данные формы" }, { status: 400 });
    }

    // Моки CRM/Telegram — реальная отправка подключится через env.
    const { website, ...lead } = parsed.data;
    console.log("[LEAD]", new Date().toISOString(), lead);

    // TODO (real): AmoCRM POST + Telegram bot sendMessage
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Ошибка отправки. Попробуйте позже." }, { status: 500 });
  }
}
