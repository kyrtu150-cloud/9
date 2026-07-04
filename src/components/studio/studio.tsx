"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles, Wand2, Check, RefreshCw, Download, Loader2,
  Image as ImageIcon, ArrowRight, ArrowLeft, X, Upload, Trash2, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STYLE_OPTIONS = [
  { id: "pinterest", label: "Pinterest", emoji: "🌅" },
  { id: "catalog", label: "Каталог", emoji: "🧾" },
  { id: "image", label: "Имидж", emoji: "💎" },
  { id: "brand", label: "Бренд", emoji: "🔥" },
  { id: "lifestyle", label: "Лайфстайл", emoji: "🌿" },
  { id: "studio", label: "Студия", emoji: "📸" },
];

const ASPECT_OPTIONS = [
  { id: "3:4", label: "3:4", hint: "Карточка", cls: "aspect-[3/4]" },
  { id: "1:1", label: "1:1", hint: "Квадрат", cls: "aspect-square" },
  { id: "9:16", label: "9:16", hint: "Сторис", cls: "aspect-[9/16]" },
];

const ENHANCERS = [
  "белый фон",
  "студийный свет",
  "макро-детали",
  "лайфстайл-сцена",
  "золотой час",
  "высокая резкость",
];

const HERO_PHASES = ["Анализируем промт…", "Подбираем композицию…", "Рендерим кадр…"];

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
  const [pageStart, setPageStart] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const aspectCls = ASPECT_OPTIONS.find((a) => a.id === aspect)?.cls ?? "aspect-[3/4]";
  const allImages = hero ? [hero, ...batch] : batch;

  // Ротация фаз во время генерации hero
  useEffect(() => {
    if (phase !== "hero-loading") return;
    setPhaseIdx(0);
    const t = setInterval(() => setPhaseIdx((i) => (i + 1) % HERO_PHASES.length), 2800);
    return () => clearInterval(t);
  }, [phase]);

  // Клавиатура лайтбокса
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

  function addEnhancer(tag: string) {
    setPrompt((p) => {
      const base = p.trim();
      if (base.toLowerCase().includes(tag)) return p;
      return base ? `${base}, ${tag}` : tag;
    });
  }

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
    setPrompt("");
    setReference(null);
    setPageStart(0);
    setLightbox(null);
  }

  return (
    <div className="p-6 lg:p-10">
      <header className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/85">{meta.kicker}</div>
          <h1 className="mt-2 text-display text-3xl lg:text-4xl text-white">{meta.title}</h1>
          <p className="mt-2 text-white/65 max-w-xl">{meta.desc}</p>
        </div>
        <div className="rounded-pill glass-card px-5 py-3 flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="font-mono text-white/55 uppercase text-xs">Баланс</span>
          <span className="text-numeric text-xl text-accent">{credits}</span>
          <span className="text-white/50 text-xs">кредитов</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
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
                    <h2 className="text-display text-xl text-white">Готов творить</h2>
                    <p className="mt-2 text-white/65">
                      Опишите задачу в поле справа, при желании добавьте фото-референс —
                      и нажмите «Сгенерировать hero».
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
                  <div className={cn("relative w-full max-w-md mx-auto rounded-2xl overflow-hidden border border-accent/40", aspectCls)}>
                    {phase === "hero-loading" ? (
                      <div className="absolute inset-0 grid place-items-center bg-bg-secondary">
                        <Shimmer />
                        <div className="relative text-center px-6">
                          <Loader2 className="h-10 w-10 text-accent animate-spin mx-auto" />
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={phaseIdx}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              className="mt-4 text-display text-base text-white"
                            >
                              {HERO_PHASES[phaseIdx]}
                            </motion.div>
                          </AnimatePresence>
                          <div className="text-xs text-white/55 mt-1">~10–20 секунд</div>
                        </div>
                      </div>
                    ) : hero ? (
                      <button className="absolute inset-0 group" onClick={() => setLightbox(0)}>
                        <img src={hero.url} alt="Hero-кадр" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                      </button>
                    ) : null}
                    <div className="absolute top-3 left-3 rounded-pill bg-accent/90 px-3 py-1 text-[11px] font-mono uppercase text-bg-base font-semibold pointer-events-none">
                      HERO
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-xs uppercase tracking-wider text-accent/80">Шаг 1 из 2</div>
                    <h3 className="mt-1 text-display text-xl text-white">Утвердить hero-кадр?</h3>
                    <p className="mt-2 text-white/65 max-w-sm">
                      Если устраивает — жми «Утвердить». Если нет — «Перегенерировать»: ещё 1 кредит.
                    </p>
                    {hero && phase === "hero" && (
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button onClick={approveAndBatch} className="btn-accent">
                          <Check className="h-4 w-4" /> Утвердить и собрать серию ({meta.batchCount} кред.)
                        </button>
                        <button onClick={regenerateHero} className="btn-ghost">
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
                    <h2 className="text-display text-xl text-white">Собираем серию</h2>
                    <p className="mt-2 text-white/65">
                      Параллельно генерируем {meta.batchCount} кадров в едином стиле hero. 30–60 секунд.
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
                      <div className="text-display text-xl text-white">
                        Серия из {allImages.length} кадров
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={downloadAll} className="btn-accent text-sm">
                        <Download className="h-4 w-4" /> Скачать все
                      </button>
                      <button onClick={reset} className="btn-ghost text-sm">
                        <RefreshCw className="h-4 w-4" /> Новый проект
                      </button>
                    </div>
                  </div>
                  <FourPager
                    images={allImages}
                    pageStart={pageStart}
                    setPageStart={setPageStart}
                    onOpen={(globalIdx) => setLightbox(globalIdx)}
                  />
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

        {/* Правая панель */}
        <aside className="space-y-4">
          {/* Промт */}
          <div className="glass-card p-5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-accent">Промт</div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={phase === "hero-loading" || phase === "batch-loading"}
              placeholder="Например: премиум-кроссовки на белом фоне, мягкий студийный свет, минимализм, фокус на текстуре..."
              rows={5}
              maxLength={2000}
              className="mt-3 w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-accent/60 focus:bg-white/[0.05] transition-colors outline-none resize-none"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ENHANCERS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => addEnhancer(tag)}
                  disabled={phase === "hero-loading" || phase === "batch-loading"}
                  className="inline-flex items-center gap-1 rounded-pill border border-white/12 bg-white/[0.02] px-2.5 py-1 text-[11px] text-white/65 hover:border-accent/50 hover:text-accent transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Референс */}
          <div className="glass-card p-5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-accent">
              Референс <span className="text-white/40 normal-case">(необязательно)</span>
            </div>
            {reference ? (
              <div className="mt-3 relative rounded-xl overflow-hidden border border-white/15">
                <img src={reference} alt="Референс" className="w-full max-h-40 object-cover" />
                <button
                  onClick={() => setReference(null)}
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-bg-base/80 border border-white/20 grid place-items-center text-white hover:text-rose-400"
                  aria-label="Удалить референс"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  acceptFile(e.dataTransfer.files?.[0]);
                }}
                className={cn(
                  "mt-3 w-full rounded-xl border border-dashed px-4 py-6 text-center transition-colors",
                  dragOver ? "border-accent bg-accent/10" : "border-white/15 bg-white/[0.02] hover:border-accent/50"
                )}
              >
                <Upload className="h-5 w-5 text-accent mx-auto" />
                <div className="mt-2 text-sm text-white/70">Перетащите фото или кликните</div>
                <div className="text-[11px] text-white/40 mt-0.5">JPG / PNG / WebP, до 4 МБ</div>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />
          </div>

          {/* Стиль + формат */}
          <div className="glass-card p-5 space-y-4">
            <div>
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
                    <span className="text-base">{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-accent">Формат кадра</div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {ASPECT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setAspect(opt.id)}
                    className={cn(
                      "rounded-xl border px-2 py-2.5 text-center transition-all",
                      aspect === opt.id
                        ? "border-accent bg-accent/15 text-white"
                        : "border-white/10 bg-white/[0.02] text-white/70 hover:border-accent/40"
                    )}
                  >
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-[10px] text-white/45">{opt.hint}</div>
                  </button>
                ))}
              </div>
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
            1. Опиши задачу, добавь референс и стиль.<br />
            2. Получи hero-кадр (1 кредит).<br />
            3. Утверди или перегенерируй.<br />
            4. После апрува — серия из {meta.batchCount} в едином стиле.
          </div>
        </aside>
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
            <button
              className="absolute top-5 right-5 h-11 w-11 rounded-full border border-white/20 grid place-items-center hover:bg-white/10 text-white"
              aria-label="Закрыть"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lightbox - 1 + allImages.length) % allImages.length);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/5 border border-white/15 grid place-items-center hover:bg-accent hover:text-bg-base text-white transition-colors"
              aria-label="Предыдущий кадр"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lightbox + 1) % allImages.length);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/5 border border-white/15 grid place-items-center hover:bg-accent hover:text-bg-base text-white transition-colors"
              aria-label="Следующий кадр"
            >
              <ArrowRight className="h-5 w-5" />
            </button>

            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-h-[82svh] max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={allImages[lightbox].url}
                alt={`Кадр ${lightbox + 1}`}
                className="mx-auto max-h-[82svh] rounded-2xl border border-white/15 object-contain"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <span className="rounded-pill bg-bg-base/80 backdrop-blur px-3.5 py-1.5 text-xs font-mono text-white/80">
                  {lightbox + 1} / {allImages.length}
                  {allImages[lightbox].isHero && <span className="text-accent ml-2">HERO</span>}
                </span>
                <a
                  href={allImages[lightbox].url}
                  download={`jooz-${project?.id ?? "img"}-${lightbox + 1}.png`}
                  className="rounded-pill bg-accent text-bg-base px-4 py-1.5 text-xs font-medium inline-flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> Скачать
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FourPager({
  images,
  pageStart,
  setPageStart,
  onOpen,
}: {
  images: GenImage[];
  pageStart: number;
  setPageStart: (n: number) => void;
  onOpen: (globalIdx: number) => void;
}) {
  const total = images.length;
  const page = images.slice(pageStart, pageStart + 4);
  const canPrev = pageStart > 0;
  const canNext = pageStart + 4 < total;

  return (
    <div className="flex flex-col flex-1">
      <div className="grid grid-cols-2 gap-3 flex-1">
        {page.map((img, i) => (
          <motion.button
            key={img.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onOpen(pageStart + i)}
            className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 group text-left"
          >
            <img
              src={img.url}
              alt={`Кадр ${pageStart + i + 1}`}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            {img.isHero && (
              <span className="absolute top-3 left-3 rounded-pill bg-accent/90 px-3 py-1 text-[10px] font-mono uppercase text-bg-base font-semibold">
                HERO
              </span>
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-bg-base/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity grid items-end p-3">
              <span className="justify-self-end rounded-pill bg-accent text-bg-base px-3 py-1.5 text-xs font-medium inline-flex items-center gap-1.5">
                Открыть
              </span>
            </span>
          </motion.button>
        ))}
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
          <ArrowLeft className="h-3.5 w-3.5" /> Предыдущие
        </button>
        <div className="text-xs font-mono text-white/55 uppercase">
          {pageStart + 1}–{Math.min(pageStart + 4, total)} из {total}
        </div>
        <button
          onClick={() => setPageStart(Math.min(Math.max(0, total - 4), pageStart + 4))}
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
