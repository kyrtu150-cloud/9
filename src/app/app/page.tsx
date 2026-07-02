import Link from "next/link";
import { requireUser } from "@/lib/require-user";
import { Camera, Layers, Film, BarChart3, ArrowRight, Sparkles, Zap, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const QUICK_START = [
  { href: "/app/cover", Icon: Camera, label: "Генерация обложки", desc: "10 главных фото для A/B" },
  { href: "/app/funnel", Icon: Layers, label: "Фотоворонка", desc: "15 фото в едином стиле" },
  { href: "/app/video", Icon: Film, label: "Видео-обложка", desc: "Короткий ролик 5-10 сек" },
  { href: "/app/infographic", Icon: BarChart3, label: "Инфографика", desc: "Сборка из фото + текст" },
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
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/85">Дашборд</div>
        <h1 className="mt-2 font-display text-4xl lg:text-5xl uppercase text-white">
          Привет, {user?.name ?? "креатор"} 👋
        </h1>
        <p className="mt-2 text-white/65 max-w-xl">
          Готов сгенерировать продающий контент? Выбирай инструмент и поехали.
        </p>
      </header>

      {/* Метрики */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric Icon={Sparkles} label="Кредитов осталось" value={String(user?.credits ?? 0)} accent />
        <Metric Icon={Zap} label="Тариф" value={(user?.plan ?? "free").toUpperCase()} />
        <Metric Icon={Camera} label="Проектов всего" value={String(user?.projects?.length ?? 0)} />
        <Metric Icon={Clock} label="Следующее списание" value={user?.planRenewsAt ? new Date(user.planRenewsAt).toLocaleDateString("ru-RU") : "—"} />
      </div>

      {/* Быстрый старт */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-2xl uppercase text-white">Быстрый старт</h2>
          <Link href="/app/projects" className="text-sm text-accent hover:underline">
            Все проекты →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {QUICK_START.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group glass-card p-6 hover:border-accent/55 transition-all"
            >
              <div className="grid place-items-center h-12 w-12 rounded-full bg-accent/12 border border-accent/30 mb-4 group-hover:scale-110 transition-transform">
                <q.Icon className="h-5 w-5 text-accent" />
              </div>
              <div className="font-display text-lg uppercase text-white">{q.label}</div>
              <div className="text-sm text-white/55 mt-1">{q.desc}</div>
              <div className="mt-4 flex items-center gap-2 text-accent text-sm">
                Запустить <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Недавние проекты */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-2xl uppercase text-white">Недавние проекты</h2>
          <Link href="/app/projects" className="text-sm text-accent hover:underline">
            Смотреть все →
          </Link>
        </div>
        {user?.projects?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {user.projects.map((p: any) => (
              <Link
                key={p.id}
                href={`/app/projects/${p.id}`}
                className="group glass-card overflow-hidden hover:border-accent/55 transition-colors"
              >
                <div className="aspect-square bg-bg-secondary relative overflow-hidden">
                  {p.images[0] ? (
                    <img src={p.images[0].url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-white/30 font-display text-2xl uppercase">
                      {p.type}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-accent/80">{p.type}</div>
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

function Metric({
  Icon,
  label,
  value,
  accent,
}: {
  Icon: typeof Sparkles;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`glass-card p-5 ${accent ? "border-accent/50" : ""}`}>
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-white/55">
        <Icon className="h-3.5 w-3.5 text-accent" />
        {label}
      </div>
      <div className="mt-2 font-display text-3xl text-white">{value}</div>
    </div>
  );
}
