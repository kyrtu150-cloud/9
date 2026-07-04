"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Play, X, TrendingUp, Check } from "lucide-react";
import { ArtTile } from "@/components/site/sunset-art";
import type { Content } from "@/lib/content";
import { c } from "@/lib/content";

const STYLE_LABELS = ["Pinterest", "Каталог", "Имидж", "Бренд"] as const;
const TONE_BY_STYLE: Record<string, "orange" | "teal" | "warm" | "gray"> = {
  Pinterest: "warm",
  "Каталог": "gray",
  "Имидж": "teal",
  "Бренд": "orange",
};

export function Cases({ content }: { content: Content }) {
  return (
    <section id="cases" className="relative isolate py-24 lg:py-32">
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-bg-base via-bg-secondary/30 to-bg-base" />

      <div className="container-wide relative">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="h-section"
        >
          <span className="block text-white">{c(content, "cases.title.line1")}</span>
          <span className="block text-accent">{c(content, "cases.title.line2")}</span>
        </motion.h2>
        <p className="mt-4 text-white/65 max-w-xl">{c(content, "cases.subtitle")}</p>

        {/* 4.1 До/После */}
        <CaseBlock
          index="01"
          kicker="Генерация обложки"
          title="До / После"
          metric={{ label: "Рост CTR", value: "+58%" }}
          align="left"
        >
          <BeforeAfter />
        </CaseBlock>

        {/* 4.2 Marquee стилей */}
        <CaseBlock
          index="02"
          kicker="Полная фотоворонка"
          title="15 фото в едином стиле"
          metric={{ label: "Конверсия в покупку", value: "+34%" }}
          align="right"
        >
          <Marquee />
        </CaseBlock>

        {/* 4.3 Видео-сетка */}
        <CaseBlock
          index="03"
          kicker="Видео-обложки"
          title="Сетка видео-превью"
          metric={{ label: "Глубина просмотра", value: "+72%" }}
          align="left"
        >
          <VideoGrid />
        </CaseBlock>

        {/* 4.4 Инфографика */}
        <CaseBlock
          index="04"
          kicker="Инфографика"
          title="Сборка инфографики"
          metric={{ label: "Время на карточку", value: "−85%" }}
          align="right"
        >
          <InfographicCarousel />
        </CaseBlock>
      </div>
    </section>
  );
}

function CaseBlock({
  index,
  kicker,
  title,
  metric,
  align,
  children,
}: {
  index: string;
  kicker: string;
  title: string;
  metric: { label: string; value: string };
  align: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
    >
      <div className={`lg:col-span-4 ${align === "right" ? "lg:order-2" : ""}`}>
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-accent/80">
          {index} / {kicker}
        </div>
        <h3 className="mt-4 text-display text-2xl lg:text-4xl text-white leading-tight">
          {title}
        </h3>
        <div className="mt-6 inline-flex items-center gap-3 glass-card px-5 py-3">
          <TrendingUp className="h-5 w-5 text-accent" />
          <div>
            <div className="text-xs text-white/55 uppercase tracking-wider">{metric.label}</div>
            <div className="text-numeric text-2xl text-accent leading-none mt-0.5">{metric.value}</div>
          </div>
        </div>
      </div>
      <div className={`lg:col-span-8 ${align === "right" ? "lg:order-1" : ""}`}>{children}</div>
    </motion.div>
  );
}

/** Демо «до/после»: серая скучная карточка ↔ брендовый JOOZ-кадр. */
function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setPos(Math.max(2, Math.min(98, x)));
    };
    const onUp = () => (dragging.current = false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] overflow-hidden rounded-card border border-white/10 select-none touch-none"
      onPointerDown={() => (dragging.current = true)}
    >
      {/* ДО (слева от ручки): плоско и серо */}
      <div className="absolute inset-0 bg-[#2e2e2e] grid place-items-center">
        <div className="h-2/3 w-1/3 rounded-lg bg-[#454545] shadow-inner" />
        <div className="absolute bottom-6 left-[8%] text-white/35 text-sm">
          Фото поставщика
        </div>
      </div>

      {/* ПОСЛЕ (справа от ручки): брендовый закат */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <ArtTile tone="orange" className="absolute inset-0" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-2/3 w-1/3 rounded-lg bg-gradient-to-b from-[#fff3e6] to-[#ffc599] shadow-accent-strong" />
        </div>
        <div className="absolute bottom-6 right-[8%] text-white text-sm font-medium drop-shadow">
          Кадр из JOOZ.ai
        </div>
      </div>

      {/* Лейблы */}
      <div className="absolute top-4 left-4 rounded-pill bg-bg-base/70 backdrop-blur px-3 py-1 text-xs font-mono uppercase text-white/85">До</div>
      <div className="absolute top-4 right-4 rounded-pill bg-accent/90 px-3 py-1 text-xs font-mono uppercase text-bg-base font-semibold">После JOOZ</div>

      {/* Ручка слайдера */}
      <div className="absolute inset-y-0 w-px bg-white pointer-events-none" style={{ left: `${pos}%` }} />
      <div
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-accent shadow-accent-strong grid place-items-center cursor-grab active:cursor-grabbing"
        style={{ left: `${pos}%` }}
        onPointerDown={(e) => {
          e.stopPropagation();
          dragging.current = true;
        }}
      >
        <div className="flex gap-0.5">
          <div className="h-3 w-0.5 bg-bg-base" />
          <div className="h-3 w-0.5 bg-bg-base" />
        </div>
      </div>
    </div>
  );
}

function Marquee() {
  const tiles = Array.from({ length: 12 }, (_, i) => STYLE_LABELS[i % 4]);
  return (
    <div className="relative overflow-hidden mask-fade-y rounded-card">
      <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused]" style={{ width: "200%" }}>
        {[...tiles, ...tiles].map((label, i) => (
          <ArtTile
            key={i}
            tone={TONE_BY_STYLE[label]}
            label={label}
            className="shrink-0 h-56 w-44 lg:h-72 lg:w-56 rounded-2xl border border-white/10"
          />
        ))}
      </div>
    </div>
  );
}

function VideoGrid() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const tones: ("orange" | "teal" | "warm")[] = ["orange", "teal", "warm", "teal", "orange", "warm"];
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {tones.map((tone, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 group"
          >
            <ArtTile tone={tone} className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/70 to-transparent" />
            <div className="absolute inset-0 grid place-items-center opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="h-12 w-12 rounded-full bg-accent grid place-items-center">
                <Play className="h-5 w-5 text-bg-base fill-bg-base ml-0.5" />
              </div>
            </div>
          </button>
        ))}
      </div>
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] bg-bg-base/85 backdrop-blur-xl grid place-items-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 h-12 w-12 rounded-full border border-white/20 grid place-items-center hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
          <ArtTile
            tone={tones[lightbox]}
            label={`Видео-превью #${lightbox + 1}`}
            className="max-h-[85svh] aspect-[3/4] w-full max-w-md rounded-2xl border border-white/15"
          />
        </div>
      )}
    </>
  );
}

/** Демо-инфографика: карточка товара + выезжающие плашки-факты. */
function InfographicCarousel() {
  const [active, setActive] = useState(0);
  const slides = [
    { tone: "orange" as const, bullets: ["Гипоаллергенный состав", "Выдерживает −30°C", "Гарантия 2 года"] },
    { tone: "teal" as const, bullets: ["10 000+ продаж", "Рейтинг 4.9", "Доставка за 1 день"] },
    { tone: "warm" as const, bullets: ["Эко-материалы", "Сделано в России", "3 цвета в наличии"] },
  ];
  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-white/10">
        {slides.map((slide, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.04 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
            style={{ pointerEvents: i === active ? "auto" : "none" }}
          >
            <ArtTile tone={slide.tone} className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg-base/70 via-bg-base/20 to-transparent" />
            <div className="absolute left-6 top-1/2 -translate-y-1/2 space-y-2.5 max-w-[60%]">
              <div className="text-display text-xl lg:text-3xl text-white">Инфографика #{i + 1}</div>
              {slide.bullets.map((b, j) => (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, x: -16 }}
                  animate={i === active ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.15 + j * 0.12 }}
                  className="flex items-center gap-2 rounded-pill bg-bg-base/70 backdrop-blur px-3.5 py-2 text-sm text-white w-fit"
                >
                  <Check className="h-4 w-4 text-accent shrink-0" />
                  {b}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2 transition-all rounded-full ${
              i === active ? "w-10 bg-accent" : "w-2 bg-white/25 hover:bg-white/40"
            }`}
            aria-label={`Слайд ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
