import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { LifeBuoy } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const { user } = await requireUser();
  const tickets = await prisma.ticket.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-3xl">
      <header>
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/85">Поддержка</div>
        <h1 className="mt-2 font-display text-4xl uppercase text-white">Помощь</h1>
        <p className="mt-2 text-white/65">Опишите вопрос — ответим в течение 6 часов.</p>
      </header>

      <form action="/api/support" method="post" className="glass-card p-7 space-y-4">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/55 font-mono">Тема</span>
          <input name="subject" required className="mt-2 w-full rounded-pill border border-white/12 bg-white/[0.02] focus:border-accent/60 focus:bg-white/[0.04] outline-none px-5 py-3 text-white" placeholder="Кратко: о чём вопрос" />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/55 font-mono">Сообщение</span>
          <textarea name="message" required rows={5} className="mt-2 w-full rounded-2xl border border-white/12 bg-white/[0.02] focus:border-accent/60 focus:bg-white/[0.04] outline-none px-5 py-3 text-white resize-none" />
        </label>
        <button className="btn-accent">Отправить</button>
      </form>

      <section>
        <h2 className="font-display text-2xl uppercase text-white mb-4">Мои обращения</h2>
        {tickets.length ? (
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="glass-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium text-white">{t.subject}</div>
                    <div className="text-xs text-white/45 mt-1">{new Date(t.createdAt).toLocaleString("ru-RU")}</div>
                  </div>
                  <span className={`text-xs rounded-pill px-3 py-1 ${
                    t.status === "closed" ? "bg-emerald-500/15 text-emerald-300" : "bg-accent/15 text-accent"
                  }`}>{t.status}</span>
                </div>
                <p className="mt-3 text-white/75 text-sm">{t.message}</p>
                {t.reply && (
                  <div className="mt-3 rounded-xl border border-accent/25 bg-accent/8 p-4 text-sm text-white/85">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-accent mb-1">Ответ команды</div>
                    {t.reply}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center text-white/55">
            <LifeBuoy className="h-10 w-10 text-white/25 mx-auto mb-3" />
            Пока нет обращений. Это хорошо!
          </div>
        )}
      </section>
    </div>
  );
}
