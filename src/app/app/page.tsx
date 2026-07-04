import Link from "next/link";
import { requireUser } from "@/lib/require-user";

export const dynamic = "force-dynamic";

const QUICK_START = [
  { href: "/app/cover", index: "01", label: "Генерация обложки", desc: "10 главных фото для A/B" },
  { href: "/app/funnel", index: "02", label: "Фотоворонка", desc: "15 фото в едином стиле" },
  { href: "/app/video", index: "03", label: "Видео-обложка", desc: "Короткий ролик 5-10 сек" },
  { href: "/app/infographic", index: "04", label: "Инфографика", desc: "Сборка из фото + текст" },
];

export default async function DashboardPage() {
  const { user } = await requireUser({
    include: {
      projects: { orderBy: { createdAt: "desc" }, take: 4, include: { images: { take: 1 } } },
    },
  });

  return (
    <div className="p-6 lg:p-10 space-y-10">
      <header>
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-pink/90">Дашборд</div>
        <h1 className="mt-2 text-display text-4xl lg:text-5xl text-white">
          Привет, <span className="text-acid">{user?.name ?? "креатор"}</span>
        </h1>
        <p className="mt-2 text-white/65 max-w-xl">
          Готов сгенерировать продающий контент? Выбирай инструмент и поехали.
        </p>
      </header>

      {/* Метрики */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Кредитов осталось" value={String(user?.credits ?? 0)} accent />
        <Metric label="Тариф" value={(user?.plan ?? "free").toUpperCase()} />
        <Metric label="Проектов" value={String(user?.projects?.length ?? 0)} />
        <Metric
          label="Следующее списание"
          value={user?.planRenewsAt ? new Date(user.planRenewsAt).toLocaleDateString("ru-RU") : "—"}
        />
      </div>

      {/* Быстрый старт */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-display text-2xl text-white">Быстрый старт</h2>
          <Link href="/app/projects" className="text-sm text-acid font-semibold hover:brightness-125">
            Все проекты →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {QUICK_START.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group glass-card p-6 hover:border-pink/50 transition-all"
            >
              <div className="text-numeric text-4xl text-acid opacity-60 group-hover:opacity-100 transition-opacity">
                {q.index}
              </div>
              <div className="mt-3 text-display text-xl text-white">{q.label}</div>
              <div className="text-sm text-white/55 mt-1">{q.desc}</div>
              <div className="mt-4 text-sm text-pink opacity-0 group-hover:opacity-100 transition-opacity">
                Запустить →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Недавние проекты */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-display text-2xl text-white">Недавние проекты</h2>
          <Link href="/app/projects" className="text-sm text-acid font-semibold hover:brightness-125">
            Смотреть все →
          </Link>
        </div>
        {user?.projects?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {user.projects.map((p: any) => (
              <Link
                key={p.id}
                href={`/app/projects/${p.id}`}
                className="group glass-card overflow-hidden hover:border-pink/50 transition-colors"
              >
                <div className="aspect-square bg-bg-secondary relative overflow-hidden">
                  {p.images[0] ? (
                    <img src={p.images[0].url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-white/25 text-display text-2xl">
                      {p.type}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-pink/85">{p.type}</div>
                  <div className="mt-1 font-medium text-white truncate">{p.title}</div>
                  <div className="text-xs text-white/45 mt-1">{new Date(p.createdAt).toLocaleDateString("ru-RU")}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card p-10 text-center">
            <div className="text-white/55">Здесь появятся ваши проекты после первой генерации.</div>
            <Link href="/app/cover" className="btn-accent mt-5 inline-flex">
              Создать первый проект
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`glass-card p-5 ${accent ? "border-pink/45" : ""}`}>
      <div className="text-[10px] font-mono uppercase tracking-wider text-white/55">{label}</div>
      <div className={`mt-2 text-numeric text-3xl ${accent ? "text-acid" : "text-white"}`}>{value}</div>
    </div>
  );
}
