"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Play, X, TrendingUp } from "lucide-react";
import type { Content } from "@/lib/content";
import { c } from "@/lib/content";

const BEFORE_IMG = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=70";
const AFTER_IMG = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80";

const FUNNEL_IMAGES = [
  "https://images.unsplash.com/photo-1551489186-cf8726f514f8?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=70",
];

const VIDEO_THUMBS = [
  "https://images.unsplash.com/photo-1496347315700-c4e29bcaca42?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1521146764736-56c929d59c83?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=70",
];

const INFO_SAMPLES = [
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=900&q=70",
];

const STYLE_MARQUEE = [
  ...FUNNEL_IMAGES,
  ...FUNNEL_IMAGES,
];

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
          <Marquee items={STYLE_MARQUEE} />
        </CaseBlock>

        {/* 4.3 Видео-сетка */}
        <CaseBlock
          index="03"
          kicker="Видео-обложки"
          title="Сетка видео-превью"
          metric={{ label: "Глубина просмотра", value: "+72%" }}
          align="left"
        >
          <VideoGrid items={VIDEO_THUMBS} />
        </CaseBlock>

        {/* 4.4 Инфографика */}
        <CaseBlock
          index="04"
          kicker="Инфографика"
          title="Сборка инфографики"
          metric={{ label: "Время на карточку", value: "−85%" }}
          align="right"
        >
          <InfographicCarousel items={INFO_SAMPLES} />
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
        <h3 className="mt-4 font-display uppercase text-3xl lg:text-5xl text-white leading-tight">
          {title}
        </h3>
        <div className="mt-6 inline-flex items-center gap-3 glass-card px-5 py-3">
          <TrendingUp className="h-5 w-5 text-accent" />
          <div>
            <div className="text-xs text-white/55 uppercase tracking-wider">{metric.label}</div>
            <div className="font-display text-2xl text-accent leading-none mt-0.5">{metric.value}</div>
          </div>
        </div>
      </div>
      <div className={`lg:col-span-8 ${align === "right" ? "lg:order-1" : ""}`}>{children}</div>
    </motion.div>
  );
}

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
      className="relative aspect-[16/10] overflow-hidden rounded-card border border-white/10 select-none"
      onPointerDown={() => (dragging.current = true)}
    >
      <Image src={BEFORE_IMG} alt="До" fill className="object-cover" sizes="800px" />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image src={AFTER_IMG} alt="После" fill className="object-cover" sizes="800px" />
      </div>

      {/* Лейблы */}
      <div className="absolute top-4 left-4 rounded-pill bg-bg-base/70 backdrop-blur px-3 py-1 text-xs font-mono uppercase text-white/85">До</div>
      <div className="absolute top-4 right-4 rounded-pill bg-accent/90 px-3 py-1 text-xs font-mono uppercase text-bg-base font-semibold">После JOOZ</div>

      {/* Handle */}
      <div
        className="absolute inset-y-0 w-px bg-white pointer-events-none"
        style={{ left: `${pos}%` }}
      />
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

function Marquee({ items }: { items: string[] }) {
  return (
    <div className="relative overflow-hidden mask-fade-y rounded-card">
      <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused]" style={{ width: "200%" }}>
        {items.map((src, i) => (
          <div
            key={i}
            className="relative shrink-0 h-56 w-44 lg:h-72 lg:w-56 rounded-2xl overflow-hidden border border-white/10"
          >
            <Image src={src} alt="" fill className="object-cover" sizes="240px" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/70 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 rounded-pill bg-accent/85 px-2 py-0.5 text-[10px] font-mono uppercase text-bg-base font-semibold">
              {["Pinterest", "Каталог", "Имидж", "Бренд"][i % 4]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoGrid({ items }: { items: string[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightbox(src)}
            className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 group"
          >
            <Image src={src} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="300px" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 to-transparent" />
            <div className="absolute inset-0 grid place-items-center opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="h-12 w-12 rounded-full bg-accent grid place-items-center">
                <Play className="h-5 w-5 text-bg-base fill-bg-base ml-0.5" />
              </div>
            </div>
          </button>
        ))}
      </div>
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-bg-base/85 backdrop-blur-xl grid place-items-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 h-12 w-12 rounded-full border border-white/20 grid place-items-center hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
          <div className="relative max-h-[90svh] aspect-[3/4] w-full max-w-md">
            <Image src={lightbox} alt="" fill className="object-contain rounded-2xl" sizes="500px" />
          </div>
        </div>
      )}
    </>
  );
}

function InfographicCarousel({ items }: { items: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-white/10">
        {items.map((src, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.05 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <Image src={src} alt="" fill className="object-cover" sizes="800px" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg-base/60 via-transparent to-transparent" />
            <div className="absolute left-6 bottom-6 max-w-xs">
              <div className="font-display text-3xl text-white uppercase">Инфографика #{i + 1}</div>
              <div className="text-white/65 mt-1 text-sm">Сборка из сгенерированных фото за один клик.</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        {items.map((_, i) => (
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
