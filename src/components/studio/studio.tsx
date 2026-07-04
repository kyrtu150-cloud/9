"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STYLE_OPTIONS = [
  { id: "pinterest", label: "Pinterest" },
  { id: "catalog", label: "Каталог" },
  { id: "image", label: "Имидж" },
  { id: "brand", label: "Бренд" },
  { id: "lifestyle", label: "Лайфстайл" },
  { id: "studio", label: "Студия" },
];

const ASPECT_OPTIONS = [
  { id: "3:4", label: "3:4" },
  { id: "1:1", label: "1:1" },
  { id: "9:16", label: "9:16" },
];

const EXAMPLE_PROMPTS = [
  "Премиум-кроссовки на градиентном фоне, мягкий студийный свет, минимализм",
  "Флакон парфюма в лучах закатного света, глянцевые блики, глубокие тени",
  "Беспроводные наушники в неоновом свете, тёмный фон, киберпанк-настроение",
  "Керамическая кружка на льняной скатерти, утренний свет, уют и лайфстайл",
];

const BOOSTERS =
  "коммерческая съёмка, мягкий свет, высокая детализация, чистая композиция, резкий фокус";

const HERO_PHASES = ["Анализируем промт…", "Подбираем композицию…", "Рендерим кадр…"];

const MODE_META: Record<string, { title: string; kicker: string; desc: string; batchCount: number }> = {
  cover: {
    title: "Генерация обложки",
    kicker: "01 / Обложка",
    desc: "1 hero-кадр (1 кредит) + 9 вариантов после апрува.",
    batchCount: 9,
  },
  funnel: {
    title: "Полная фотоворонка",
    kicker: "02 / Фотоворонка",
    desc: "1 hero-кадр (1 кредит) + 14 ракурсов в едином стиле.",
    batchCount: 14,
  },
  video: {
    title: "Видео-обложка",
    kicker: "03 / Видео",
    desc: "1 hero-кадр (1 кредит) + 3 кадра анимации.",
    batchCount: 3,
  },
  infographic: {
    title: "Инфографика",
    kicker: "04 / Инфографика",
    desc: "1 hero-кадр (1 кредит) + 2 варианта раскладки.",
    batchCount: 2,
  },
};

type Mode = keyof typeof MODE_META;
type GenImage = { id: string; url: string; isHero?: boolean; approved?: boolean };
type Project = { id: string; type: string; title: string; prompt: string; style?: string | null };
type Phase = "idle" | "hero-loading" | "hero" | "batch-loading" | "done";

const HISTORY_KEY = "jooz_prompt_history";

function loadHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveHistory(prompt: string) {
  try {
    const cur = loadHistory().filter((p) => p !== prompt);
    localStorage.setItem(HISTORY_KEY, JSON.stringify([prompt, ...cur].slice(0, 8)));
  } catch {}
}

export function Studio({
  mode,
  initialCredits,
  initialPrompt = "",
  initialStyle,
}: {
  mode: Mode;
  initialCredits: number;
  initialPrompt?: string;
  initialStyle?: string;
}) {
  const router = useRouter();
  const meta = MODE_META[mode];
  const [prompt, setPrompt] = useState(initialPrompt);
  const [style, setStyle] = useState<string>(
    STYLE_OPTIONS.find((s) => s.label === initialStyle)?.id ?? STYLE_OPTIONS[0].id
  );
  const [aspect, setAspect] = useState("3:4");
  const [reference, setReference] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [project, setProject] = useState<Project | null>(null);
  const [hero, setHero] = useState<GenImage | null>(null);
  const [batch, setBatch] = useState<GenImage[]>([]);
  const [credits, setCredits] = useState(initialCredits);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const aspectCls =
    aspect === "1:1" ? "aspect-square" : aspect === "9:16" ? "aspect-[9/16]" : "aspect-[3/4]";
  const allImages = hero ? [hero, ...batch] : batch;
  const busy = phase === "hero-loading" || phase === "batch-loading";

  useEffect(() => setHistory(loadHistory()), []);

  useEffect(() => {
    if (phase !== "hero-loading") return;
    setPhaseIdx(0);
    const t = setInterval(() => setPhaseIdx((i) => (i + 1) % HERO_PHASES.length), 2800);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? null : (i + 1) % allImages.length));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? null : (i - 1 + allImages.length) % allImages.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, allImages.length]);

  function acceptFile(file: File | undefined | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Референс должен быть изображением (JPG/PNG/WebP).");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Референс до 4 МБ. Сожмите изображение и попробуйте снова.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setReference(String(reader.result));
    reader.readAsDataURL(file);
  }

  function improvePrompt() {
    setPrompt((p) => {
      const base = p.trim().replace(/[,.\s]+$/, "");
      if (!base) return p;
      if (base.toLowerCase().includes("высокая детализация")) return p;
      return `${base}, ${BOOSTERS}`;
    });
  }

  async function startGeneration() {
    if (busy) return;
    if (prompt.trim().length < 3) {
      setError("Опишите задачу хотя бы парой слов.");
      return;
    }
    setError(null);
    saveHistory(prompt.trim());
    setHistory(loadHistory());
    setHistoryOpen(false);
    setPhase("hero-loading");
    try {
      const res = await fetch("/api/studio/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode,
          prompt,
          style: STYLE_OPTIONS.find((s) => s.id === style)?.label,
          aspect,
          referenceImage: reference ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка генерации");
      setProject(data.project);
      setHero(data.image);
      setBatch([]);
      setCredits(data.creditsLeft);
      setPhase("hero");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
      setPhase("idle");
    }
  }

  async function regenerateHero() {
    if (!project || busy) return;
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
    if (!project || !hero || busy) return;
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

  async function toggleFavorite(img: GenImage) {
    const next = new Set(favorites);
    next.has(img.id) ? next.delete(img.id) : next.add(img.id);
    setFavorites(next);
    try {
      await fetch("/api/studio/favorite", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageId: img.id }),
      });
    } catch {}
  }

  function useAsReference(img: GenImage) {
    setReference(img.url);
    setLightbox(null);
  }

  function downloadAll() {
    allImages.forEach((img, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = img.url;
        a.download = `jooz-${project?.id ?? "img"}-${i + 1}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, i * 350);
    });
  }

  function reset() {
    setPhase("idle");
    setHero(null);
    setBatch([]);
    setProject(null);
    setLightbox(null);
  }

  return (
    <div
      className="flex flex-col h-[100svh]"
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        acceptFile(e.dataTransfer.files?.[0]);
      }}
    >
      {/* Шапка */}
      <header className="flex items-center justify-between gap-4 px-6 lg:px-10 pt-6 pb-4 shrink-0">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-pink/90">{meta.kicker}</div>
          <h1 className="mt-1 text-display text-2xl lg:text-3xl text-white">{meta.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:block text-xs text-white/45 max-w-[260px] text-right">{meta.desc}</span>
          <div className="rounded-pill border border-white/12 bg-white/[0.03] px-4 py-2 text-sm whitespace-nowrap">
            <span className="text-numeric text-lg text-acid font-bold">{credits}</span>
            <span className="text-white/50 text-xs ml-1.5">кредитов</span>
          </div>
        </div>
      </header>

      {/* Холст */}
      <div className="flex-1 min-h-0 px-6 lg:px-10 pb-3">
        <div
          className={cn(
            "relative h-full rounded-card border bg-card-bg overflow-hidden transition-colors",
            dragOver ? "border-pink" : "border-white/10"
          )}
        >
          <div aria-hidden className="absolute inset-0 sunset-bg opacity-25" />
          {dragOver && (
            <div className="absolute inset-0 z-20 grid place-items-center bg-bg-base/70 backdrop-blur-sm border-2 border-dashed border-pink rounded-card">
              <span className="text-display text-xl text-acid">Отпустите — станет референсом</span>
            </div>
          )}

          <div className="relative h-full overflow-y-auto p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {phase === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <h2 className="text-display text-3xl lg:text-5xl text-white">
                    Что создаём <span className="text-acid">сегодня?</span>
                  </h2>
                  <p className="mt-3 text-white/60 max-w-md">
                    Опишите товар в поле снизу — или начните с готового примера.
                  </p>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                    {EXAMPLE_PROMPTS.map((ex) => (
                      <button
                        key={ex}
                        onClick={() => setPrompt(ex)}
                        className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 text-left text-sm text-white/75 hover:border-pink/50 hover:text-white hover:bg-pink/5 transition-colors"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {(phase === "hero-loading" || phase === "hero") && (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col lg:flex-row items-center justify-center gap-8"
                >
                  <div className={cn("relative w-full max-w-sm rounded-2xl overflow-hidden border border-pink/40 shrink-0", aspectCls)}>
                    {phase === "hero-loading" ? (
                      <div className="absolute inset-0 grid place-items-center bg-bg-secondary">
                        <Shimmer />
                        <div className="relative text-center px-6">
                          <span className="mx-auto block h-10 w-10 rounded-full border-2 border-pink border-t-transparent animate-spin" />
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={phaseIdx}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              className="mt-4 text-display text-lg text-white"
                            >
                              {HERO_PHASES[phaseIdx]}
                            </motion.div>
                          </AnimatePresence>
                          <div className="text-xs text-white/55 mt-1">~10–20 секунд</div>
                        </div>
                      </div>
                    ) : hero ? (
                      <button className="absolute inset-0 group" onClick={() => setLightbox(0)}>
                        <img
                          src={hero.url}
                          alt="Hero-кадр"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </button>
                    ) : null}
                    <span className="absolute top-3 left-3 rounded-pill bg-gradient-acid px-3 py-1 text-[10px] font-mono uppercase text-white font-semibold pointer-events-none">
                      hero
                    </span>
                  </div>

                  <div className="max-w-sm text-center lg:text-left">
                    <div className="font-mono text-xs uppercase tracking-wider text-pink/90">Шаг 1 из 2</div>
                    <h3 className="mt-1 text-display text-2xl text-white">Утвердить hero-кадр?</h3>
                    <p className="mt-2 text-white/60 text-sm">
                      Утверждаешь — студия соберёт серию из {meta.batchCount} кадров в этом стиле.
                      Не нравится — перегенерируй за 1 кредит.
                    </p>
                    {hero && phase === "hero" && (
                      <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
                        <button onClick={approveAndBatch} className="btn-accent text-sm">
                          Утвердить · {meta.batchCount} кр.
                        </button>
                        <button onClick={regenerateHero} className="btn-ghost text-sm">
                          Перегенерировать · 1 кр.
                        </button>
                        <button
                          onClick={() => useAsReference(hero)}
                          className="rounded-pill px-4 py-2 text-sm text-white/60 hover:text-pink transition-colors"
                        >
                          Сделать референсом
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {phase === "batch-loading" && (
                <motion.div
                  key="batch-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full grid place-items-center"
                >
                  <div className="text-center max-w-md">
                    <span className="mx-auto block h-14 w-14 rounded-full border-2 border-pink border-t-transparent animate-spin" />
                    <h2 className="mt-6 text-display text-2xl text-white">Собираем серию</h2>
                    <p className="mt-2 text-white/60">
                      Параллельно генерируем {meta.batchCount} кадров. 30–60 секунд.
                    </p>
                    <div className="mt-6 grid grid-cols-4 gap-2 max-w-xs mx-auto">
                      {Array.from({ length: Math.min(meta.batchCount, 8) }).map((_, i) => (
                        <div key={i} className="aspect-square rounded-md bg-pink/10 border border-pink/25 overflow-hidden relative">
                          <Shimmer delay={i * 0.15} />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="min-h-full flex flex-col"
                >
                  <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                    <div>
                      <div className="font-mono text-xs uppercase tracking-wider text-pink">Готово</div>
                      <div className="text-display text-2xl text-white">Серия из {allImages.length} кадров</div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <button onClick={downloadAll} className="text-acid font-semibold hover:brightness-125 transition">
                        Скачать все ↓
                      </button>
                      <button onClick={reset} className="text-white/60 hover:text-white transition-colors">
                        Новый проект +
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {allImages.map((img, i) => (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: Math.min(i * 0.05, 0.6) }}
                        className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 group"
                      >
                        <button className="absolute inset-0" onClick={() => setLightbox(i)}>
                          <img
                            src={img.url}
                            alt={`Кадр ${i + 1}`}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                          />
                        </button>
                        {img.isHero && (
                          <span className="absolute top-2.5 left-2.5 rounded-pill bg-gradient-acid px-2.5 py-0.5 text-[10px] font-mono uppercase text-white font-semibold pointer-events-none">
                            hero
                          </span>
                        )}
                        <button
                          onClick={() => toggleFavorite(img)}
                          aria-label="В избранное"
                          className={cn(
                            "absolute top-2 right-2 h-8 w-8 rounded-full grid place-items-center text-base transition-colors backdrop-blur",
                            favorites.has(img.id)
                              ? "bg-pink text-white"
                              : "bg-bg-base/60 text-white/60 opacity-0 group-hover:opacity-100 hover:text-pink"
                          )}
                        >
                          ★
                        </button>
                        <div className="absolute inset-x-0 bottom-0 p-2.5 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-bg-base/80 to-transparent">
                          <a
                            href={img.url}
                            download={`jooz-${project?.id}-${i + 1}.png`}
                            className="rounded-pill bg-white/10 backdrop-blur px-3 py-1 text-xs text-white hover:bg-white/20"
                          >
                            Скачать
                          </a>
                          <button
                            onClick={() => useAsReference(img)}
                            className="rounded-pill bg-gradient-acid px-3 py-1 text-xs text-white font-medium"
                          >
                            Референс
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Нижний промт-док ─────────────────────────────────────── */}
      <div className="shrink-0 px-6 lg:px-10 pb-6 relative z-30">
        {error && (
          <div className="mb-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-200 flex items-center justify-between gap-4">
            {error}
            <button onClick={() => setError(null)} className="text-rose-300/70 hover:text-white">✕</button>
          </div>
        )}

        {/* История промтов */}
        <AnimatePresence>
          {historyOpen && history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mb-2 rounded-2xl border border-white/12 bg-bg-secondary/95 backdrop-blur-xl p-2 max-h-56 overflow-y-auto"
            >
              {history.map((h) => (
                <button
                  key={h}
                  onClick={() => {
                    setPrompt(h);
                    setHistoryOpen(false);
                  }}
                  className="block w-full text-left rounded-xl px-4 py-2.5 text-sm text-white/70 hover:bg-pink/10 hover:text-white transition-colors truncate"
                >
                  {h}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass-card !rounded-[24px] p-3 lg:p-4">
          {/* Строка ввода */}
          <div className="flex items-end gap-3">
            {reference && (
              <div className="relative shrink-0">
                <img src={reference} alt="Референс" className="h-14 w-14 rounded-xl object-cover border border-pink/40" />
                <button
                  onClick={() => setReference(null)}
                  aria-label="Убрать референс"
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-bg-base border border-white/25 text-[10px] text-white/80 hover:text-pink"
                >
                  ✕
                </button>
              </div>
            )}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  startGeneration();
                }
              }}
              disabled={busy}
              placeholder="Опишите товар, фон, свет и настроение…"
              rows={2}
              maxLength={2000}
              className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/30 outline-none resize-none leading-relaxed py-1"
            />
            <button
              onClick={startGeneration}
              disabled={busy || prompt.trim().length < 3}
              className="btn-accent shrink-0 !px-7 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {busy ? "Генерация…" : "Создать"}
            </button>
          </div>

          {/* Строка настроек */}
          <div className="mt-3 flex items-center gap-x-4 gap-y-2 flex-wrap text-[13px]">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/35 mr-1">Стиль</span>
              {STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setStyle(opt.id)}
                  disabled={busy}
                  className={cn(
                    "rounded-pill px-3 py-1 transition-colors",
                    style === opt.id
                      ? "bg-gradient-acid text-white font-medium"
                      : "text-white/55 hover:text-white hover:bg-white/5"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <span className="hidden lg:block h-4 w-px bg-white/10" />

            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/35 mr-1">Формат</span>
              {ASPECT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAspect(opt.id)}
                  disabled={busy}
                  className={cn(
                    "rounded-pill px-3 py-1 transition-colors",
                    aspect === opt.id
                      ? "bg-gradient-acid text-white font-medium"
                      : "text-white/55 hover:text-white hover:bg-white/5"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <span className="hidden lg:block h-4 w-px bg-white/10" />

            <button
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="text-white/55 hover:text-pink transition-colors"
            >
              {reference ? "Заменить референс" : "+ Референс"}
            </button>
            <button onClick={improvePrompt} disabled={busy || !prompt.trim()} className="text-white/55 hover:text-pink transition-colors disabled:opacity-40">
              Улучшить промт
            </button>
            {history.length > 0 && (
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className={cn("transition-colors", historyOpen ? "text-pink" : "text-white/55 hover:text-pink")}
              >
                История {historyOpen ? "▴" : "▾"}
              </button>
            )}

            <span className="ml-auto hidden md:block font-mono text-[10px] text-white/30">
              Ctrl+Enter — создать · hero 1 кр. · серия {meta.batchCount} кр.
            </span>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => acceptFile(e.target.files?.[0])}
        />
      </div>

      {/* Лайтбокс */}
      <AnimatePresence>
        {lightbox !== null && allImages[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-bg-base/90 backdrop-blur-xl grid place-items-center p-4 lg:p-10"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-5 right-6 text-2xl text-white/60 hover:text-white" aria-label="Закрыть">
              ✕
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lightbox - 1 + allImages.length) % allImages.length);
              }}
              className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 text-3xl text-white/50 hover:text-pink transition-colors px-3"
              aria-label="Предыдущий кадр"
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lightbox + 1) % allImages.length);
              }}
              className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 text-3xl text-white/50 hover:text-pink transition-colors px-3"
              aria-label="Следующий кадр"
            >
              →
            </button>

            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-h-[82svh] max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={allImages[lightbox].url}
                alt={`Кадр ${lightbox + 1}`}
                className="mx-auto max-h-[80svh] rounded-2xl border border-white/15 object-contain"
              />
              <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                <span className="font-mono text-xs text-white/50">
                  {lightbox + 1} / {allImages.length}
                  {allImages[lightbox].isHero && <span className="text-pink ml-2">hero</span>}
                </span>
                <button
                  onClick={() => toggleFavorite(allImages[lightbox])}
                  className={cn("transition-colors", favorites.has(allImages[lightbox].id) ? "text-pink" : "text-white/60 hover:text-pink")}
                >
                  ★ {favorites.has(allImages[lightbox].id) ? "В избранном" : "В избранное"}
                </button>
                <button onClick={() => useAsReference(allImages[lightbox])} className="text-white/60 hover:text-pink transition-colors">
                  Сделать референсом
                </button>
                <a
                  href={allImages[lightbox].url}
                  download={`jooz-${project?.id ?? "img"}-${lightbox + 1}.png`}
                  className="text-acid font-semibold"
                >
                  Скачать ↓
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Shimmer({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-pink/20 to-transparent animate-[shimmer_1.8s_infinite]"
      style={{ animationDelay: `${delay}s`, backgroundSize: "200% 100%" }}
    />
  );
}
