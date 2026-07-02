import { NextResponse } from "next/server";
import { z } from "zod";

const Schema = z.object({
  name: z.string().min(2).max(100),
  contact: z.string().min(3).max(200),
  message: z.string().max(2000).optional().default(""),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = Schema.parse(body);

    // Моки CRM/Telegram. Реальная отправка подключится через env.
    console.log("[LEAD]", new Date().toISOString(), data);

    // TODO (real): AmoCRM POST + Telegram bot sendMessage
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
