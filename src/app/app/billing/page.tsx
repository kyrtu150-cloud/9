import { requireUser } from "@/lib/require-user";
import { Sparkles, Crown, Zap, Plus, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PLANS = [
  { id: "start", name: "Start", Icon: Sparkles, monthly: 1990, credits: 50 },
  { id: "pro", name: "Pro", Icon: Zap, monthly: 4990, credits: 200, highlight: true },
  { id: "business", name: "Business", Icon: Crown, monthly: 12990, credits: 800 },
];

const PACKS = [
  { credits: 50, price: 590 },
  { credits: 200, price: 1990 },
  { credits: 500, price: 4490 },
  { credits: 1000, price: 7990 },
];

export default async function BillingPage() {
  const { user } = await requireUser({
    include: { transactions: { orderBy: { createdAt: "desc" }, take: 10 } },
  });

  return (
    <div className="p-6 lg:p-10 space-y-10">
      <header>
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/85">Биллинг</div>
        <h1 className="mt-2 font-display text-4xl lg:text-5xl uppercase text-white">Подписка и кредиты</h1>
        <p className="mt-2 text-white/65 max-w-xl">Управляйте тарифом и докупайте кредиты по необходимости.</p>
      </header>

      <section className="glass-card p-7 flex items-center justify-between flex-wrap gap-6">
        <div>
          <div className="text-xs uppercase tracking-wider font-mono text-white/55">Текущий тариф</div>
          <div className="mt-1 font-display text-3xl uppercase text-white">{user?.plan?.toUpperCase() ?? "FREE"}</div>
          <div className="mt-1 text-sm text-white/55">Баланс: <span className="text-accent font-display text-lg">{user?.credits ?? 0}</span> кредитов</div>
        </div>
        <div className="text-sm text-amber-300/80">⚠ Оплата пока в режиме демо — реальные платежи подключим позже.</div>
      </section>

      <section>
        <h2 className="font-display text-2xl uppercase text-white mb-4">Сменить тариф</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((p) => (
            <div key={p.id} className={`glass-card p-6 ${p.highlight ? "border-accent/55" : ""}`}>
              <div className="flex items-center gap-3">
                <p.Icon className="h-5 w-5 text-accent" />
                <span className="font-display text-2xl uppercase text-white">{p.name}</span>
              </div>
              <div className="mt-4 font-display text-3xl text-white">{formatPrice(p.monthly)} <span className="text-xs text-white/55">/мес</span></div>
              <div className="mt-1 text-sm text-white/55">{p.credits} кредитов / месяц</div>
              <form action="/api/billing/mock-checkout" method="post">
                <input type="hidden" name="plan" value={p.id} />
                <button className={`mt-5 w-full justify-center inline-flex rounded-pill py-3 font-medium transition-all ${
                  p.highlight ? "bg-accent text-bg-base hover:bg-accent-hover" : "border border-white/15 text-white hover:bg-white/10"
                }`}>
                  Перейти на {p.name}
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl uppercase text-white mb-4">Докупить кредиты</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PACKS.map((pk) => (
            <form key={pk.credits} action="/api/billing/mock-checkout" method="post">
              <input type="hidden" name="credits" value={pk.credits} />
              <input type="hidden" name="price" value={pk.price} />
              <button className="w-full text-left glass-card p-5 hover:border-accent/55 transition-colors">
                <div className="flex items-center gap-2 text-accent">
                  <Plus className="h-4 w-4" />
                  <span className="font-display text-2xl">{pk.credits}</span>
                </div>
                <div className="mt-2 font-display text-lg text-white">{formatPrice(pk.price)}</div>
              </button>
            </form>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl uppercase text-white mb-4">История транзакций</h2>
        {user?.transactions?.length ? (
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03] text-white/55 text-xs uppercase tracking-wider font-mono">
                <tr>
                  <th className="text-left px-5 py-3">Дата</th>
                  <th className="text-left px-5 py-3">Тип</th>
                  <th className="text-right px-5 py-3">Сумма</th>
                  <th className="text-right px-5 py-3">Статус</th>
                </tr>
              </thead>
              <tbody>
                {user.transactions.map((t: any) => (
                  <tr key={t.id} className="border-t border-white/5">
                    <td className="px-5 py-3 text-white/75">{new Date(t.createdAt).toLocaleString("ru-RU")}</td>
                    <td className="px-5 py-3 text-white">{t.kind}</td>
                    <td className="px-5 py-3 text-right font-mono text-accent">{formatPrice(t.amount / 100)}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`text-xs rounded-pill px-2 py-0.5 ${
                        t.status === "paid" ? "bg-emerald-500/15 text-emerald-300" : "bg-white/8 text-white/60"
                      }`}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="glass-card p-8 text-center text-white/55">Пока нет транзакций.</div>
        )}
      </section>
    </div>
  );
}
