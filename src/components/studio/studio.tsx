"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Wand2, Check, RefreshCw, Download, Loader2, Image as ImageIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STYLE_OPTIONS = [
  { id: "pinterest", label: "Pinterest", emoji: "🌅" },
  { id: "catalog", label: "Каталог", emoji: "🧾" },
  { id: "image", label: "Имидж", emoji: "💎" },
  { id: "brand", label: "Бренд", emoji: "🔥" },
  { id: "lifestyle", label: "Лайфстайл", emoji: "🌿" },
  { id: "studio", label: "Студия", emoji: "📸" },
];

const MODE_META: Record<string, { title: string; kicker: string; desc: string; batchCount: number }> = {
  cover: {
    title: "Генерация обложки",
    kicker: "01 / Обложка",
    desc: "1 hero-кадр (1 кредит) + 9 вариантов после апрува (9 кредитов).",
    batchCount: 9,
  },
  funnel: {
    title: "Полная фотоворонка",
    kicker: "02 / Фотоворонка",
    desc: "1 hero-кадр (1 кредит) + 14 ракурсов в едином стиле (14 кредитов).",
    batchCount: 14,
  },
  video: {
    title: "Видео-обложка",
    kicker: "03 / Видео",
    desc: "1 hero-кадр (1 кредит) + 3 кадра анимации (3 кредита). Видео собирается из них.",
    batchCount: 3,
  },
  infographic: {
    title: "Инфографика",
    kicker: "04 / Инфографика",
    desc: "1 hero-кадр (1 кредит) + 2 варианта раскладки (2 кредита).",
    batchCount: 2,
  },
};

type Mode = keyof typeof MODE_META;
type GenImage = { id: string; url: string; isHero?: boolean; approved?: boolean };
type Project = { id: string; type: string; title: string; prompt: string; style?: string | null };
type Phase = "idle" | "hero-loading" | "hero" | "batch-loading" | "done";

export function Studio({ mode, initialCredits }: { mode: Mode; initialCredits: number }) {
  const router = useRouter();
  const meta = MODE_META[mode];
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<string>(STYLE_OPTIONS[0].id);
  const [phase, setPhase] = useState<Phase>("idle");
  const [project, setProject] = useState<Project | null>(null);
  const [hero, setHero] = useState<GenImage | null>(null);
  const [batch, setBatch] = useState<GenImage[]>([]);
  const [credits, setCredits] = useState(initialCredits);
  const [error, setError] = useState<string | null>(null);
  const [pageStart, setPageStart] = useState(0);

  async function startGeneration() {
    if (prompt.trim().length < 3) {
      setError("Опишите задачу хотя бы парой слов.");
      return;
    }
    setError(null);
    setPhase("hero-loading");
    try {
      const res = await fetch("/api/studio/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, prompt, style: STYLE_OPTIONS.find((s) => s.id === style)?.label }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка генерации");
      setProject(data.project);
      setHero(data.image);
      setCredits(data.creditsLeft);
      setPhase("hero");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
      setPhase("idle");
    }
  }

  async function regenerateHero() {
    if (!project) return;
    setPhase("hero-loading");
    try {
      const res = await fetch("/api/studio/regenerate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ projectId: project.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");
      setHero(data.image);
      setCredits(data.creditsLeft);
      setPhase("hero");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
      setPhase("hero");
    }
  }

  async function approveAndBatch() {
    if (!project || !hero) return;
    setPhase("batch-loading");
    try {
      const res = await fetch("/api/studio/batch", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ projectId: project.id, heroImageId: hero.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка серии");
      setBatch(data.images);
      setCredits(data.creditsLeft);
      setPhase("done");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
      setPhase("hero");
    }
  }

  function reset() {
    setPhase("idle");
    setHero(null);
    setBatch([]);
    setProject(null);
    setPrompt("");
    setPageStart(0);
  }

  return (
    <div className="p-6 lg:p-10">
      <header className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/85">{meta.kicker}</div>
          <h1 className="mt-2 font-display text-4xl lg:text-5xl uppercase text-white">{meta.title}</h1>
          <p className="mt-2 text-white/65 max-w-xl">{meta.desc}</p>
        </div>
        <div className="rounded-pill glass-card px-5 py-3 flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="font-mono text-white/55 uppercase text-xs">Баланс</span>
          <span className="font-display text-xl text-accent">{credits}</span>
          <span className="text-white/50 text-xs">кредитов</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Центральное окно */}
        <div className="glass-card min-h-[60svh] relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 sunset-bg opacity-30" />

          <div className="relative p-6 lg:p-10 h-full flex flex-col">
            <AnimatePresence mode="wait">
              {/* IDLE */}
              {phase === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 grid place-items-center text-center"
                >
                  <div className="max-w-md">
                    <div className="mx-auto h-20 w-20 rounded-full bg-accent/15 border border-accent/40 grid place-items-center mb-5 animate-glow-pulse">
                      <Wand2 className="h-8 w-8 text-accent" />
                    </div>
                    <h2 className="font-display text-2xl uppercase text-white">Готов творить</h2>
                    <p className="mt-2 text-white/65">
                      Опишите задачу в поле справа и нажмите «Сгенерировать hero». Это будет первый кадр будущей серии.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* HERO LOADING / RENDERED */}
              {(phase === "hero-loading" || phase === "hero") && (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center"
                >
                  <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-2xl overflow-hidden border border-accent/40">
                    {phase === "hero-loading" ? (
                      <div className="absolute inset-0 grid place-items-center bg-bg-secondary">
                        <Shimmer />
                        <div className="relative text-center">
                          <Loader2 className="h-10 w-10 text-accent animate-spin mx-auto" />
                          <div className="mt-4 font-display text-lg text-white uppercase">Генерация hero...</div>
                          <div className="text-xs text-white/55 mt-1">~10-20 секунд</div>
                        </div>
                      </div>
                    ) : hero ? (
                      <img src={hero.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    ) : null}
                    <div className="absolute top-3 left-3 rounded-pill bg-accent/90 px-3 py-1 text-[11px] font-mono uppercase text-bg-base font-semibold">
                      HERO
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-xs uppercase tracking-wider text-accent/80">Шаг 1 из 2</div>
                    <h3 className="mt-1 font-display text-2xl uppercase text-white">Утвердить hero-кадр?</h3>
                    <p className="mt-2 text-white/65 max-w-sm">
                      Если устраивает — нажми «Утвердить и сгенерировать серию». Если нет — «Перегенерировать»: ещё 1 кредит.
                    </p>
                    {hero && (
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          onClick={approveAndBatch}
                          disabled={phase === "hero-loading"}
                          className="btn-accent disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" /> Утвердить и собрать серию ({meta.batchCount} кред.)
                        </button>
                        <button
                          onClick={regenerateHero}
                          disabled={phase === "hero-loading"}
                          className="btn-ghost disabled:opacity-50"
                        >
                          <RefreshCw className="h-4 w-4" /> Перегенерировать (1 кред.)
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* BATCH LOADING */}
              {phase === "batch-loading" && (
                <motion.div
                  key="batch-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 grid place-items-center"
                >
                  <div className="text-center max-w-md">
                    <div className="relative mx-auto h-24 w-24 mb-6">
                      <div className="absolute inset-0 rounded-full border-2 border-accent/30" />
                      <div className="absolute inset-0 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                      <Wand2 className="absolute inset-0 m-auto h-10 w-10 text-accent" />
                    </div>
                    <h2 className="font-display text-2xl uppercase text-white">Собираем серию</h2>
                    <p className="mt-2 text-white/65">
                      Параллельно генерируем {meta.batchCount} кадров в едином стиле hero. Это займёт 30-60 секунд.
                    </p>
                    <div className="mt-6 grid grid-cols-4 gap-2 max-w-xs mx-auto">
                      {Array.from({ length: Math.min(meta.batchCount, 8) }).map((_, i) => (
                        <div key={i} className="aspect-square rounded-md bg-accent/10 border border-accent/30 overflow-hidden relative">
                          <Shimmer delay={i * 0.15} />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* DONE */}
              {phase === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <div className="font-mono text-xs uppercase tracking-wider text-accent">Готово!</div>
                      <div className="font-display text-2xl uppercase text-white">
                        Серия из {batch.length + 1} кадров
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={reset} className="btn-ghost text-sm">
                        <RefreshCw className="h-4 w-4" /> Новый проект
                      </button>
                    </div>
                  </div>
                  <FourPager hero={hero!} batch={batch} pageStart={pageStart} setPageStart={setPageStart} />
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Правая панель: промт + стиль */}
        <aside className="space-y-4">
          <div className="glass-card p-5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-accent">Промт</div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={phase !== "idle" && phase !== "hero"}
              placeholder="Например: премиум-кроссовки на белом фоне, мягкий студийный свет, минимализм, фокус на текстуре..."
              rows={6}
              className="mt-3 w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-accent/60 focus:bg-white/[0.05] transition-colors outline-none resize-none"
            />
            <div className="mt-2 text-[11px] text-white/40">
              {prompt.length}/2000 · опишите товар, фон, свет и эмоцию
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-accent">Стиль</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setStyle(opt.id)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm transition-all text-left flex items-center gap-2",
                    style === opt.id
                      ? "border-accent bg-accent/15 text-white"
                      : "border-white/10 bg-white/[0.02] text-white/70 hover:border-accent/40"
                  )}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGeneration}
            disabled={phase !== "idle" || prompt.trim().length < 3}
            className="btn-accent w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wand2 className="h-4 w-4" />
            {phase === "idle" ? "Сгенерировать hero (1 кр.)" : "В процессе..."}
          </button>

          <div className="glass-card p-5 text-xs text-white/55 leading-relaxed">
            <div className="flex items-center gap-2 text-accent font-mono uppercase tracking-wider text-[10px] mb-2">
              <ImageIcon className="h-3.5 w-3.5" /> Как это работает
            </div>
            1. Опиши задачу и стиль.<br />
            2. Получи hero-кадр (1 кредит).<br />
            3. Утверди или перегенерируй.<br />
            4. После апрува — серия из {meta.batchCount} в едином стиле.
          </div>
        </aside>
      </div>
    </div>
  );
}

function FourPager({
  hero,
  batch,
  pageStart,
  setPageStart,
}: {
  hero: GenImage;
  batch: GenImage[];
  pageStart: number;
  setPageStart: (n: number) => void;
}) {
  const all = [hero, ...batch];
  const total = all.length;
  const page = all.slice(pageStart, pageStart + 4);
  const canPrev = pageStart > 0;
  const canNext = pageStart + 4 < total;

  return (
    <div className="flex flex-col flex-1">
      <div className="grid grid-cols-2 gap-3 flex-1">
        {page.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 group"
          >
            <img src={img.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
            {img.isHero && (
              <div className="absolute top-3 left-3 rounded-pill bg-accent/90 px-3 py-1 text-[10px] font-mono uppercase text-bg-base font-semibold">
                HERO
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity grid items-end p-3">
              <a
                href={img.url}
                download={`jooz-${img.id}.png`}
                className="self-end rounded-pill bg-accent text-bg-base px-3 py-1.5 text-xs font-medium inline-flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Скачать
              </a>
            </div>
          </motion.div>
        ))}
        {/* Заполнители если меньше 4 */}
        {page.length < 4 &&
          Array.from({ length: 4 - page.length }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-2xl border border-dashed border-white/10 bg-white/[0.02]" />
          ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setPageStart(Math.max(0, pageStart - 4))}
          disabled={!canPrev}
          className="btn-ghost text-sm disabled:opacity-30"
        >
          ← Предыдущие
        </button>
        <div className="text-xs font-mono text-white/55 uppercase">
          {pageStart + 1}–{Math.min(pageStart + 4, total)} из {total}
        </div>
        <button
          onClick={() => setPageStart(Math.min(total - 4, pageStart + 4))}
          disabled={!canNext}
          className="btn-ghost text-sm disabled:opacity-30"
        >
          Следующие <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function Shimmer({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent animate-[shimmer_1.8s_infinite]"
      style={{ animationDelay: `${delay}s`, backgroundSize: "200% 100%" }}
    />
  );
}
