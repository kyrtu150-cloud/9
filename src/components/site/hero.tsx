"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Magnetic } from "@/components/ui/magnetic";
import { Spotlight } from "@/components/ui/spotlight";
import type { Content } from "@/lib/content";
import { c } from "@/lib/content";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80";

export function Hero({ content }: { content: Content }) {
  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden pt-32 pb-20">
      {/* Фон: тёплый закатный градиент + лучи */}
      <div aria-hidden className="absolute inset-0 sunset-bg" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(255,107,26,0.55), transparent 65%)",
        }}
      />

      <Spotlight className="relative container-wide pt-10 lg:pt-20" size={800}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Текстовый блок слева */}
          <div className="lg:col-span-5 relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-display text-[18vw] sm:text-[14vw] lg:text-[11vw] xl:text-[10rem] text-white leading-[0.82]"
            >
              {c(content, "hero.titleLarge")}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="mt-3 font-display text-3xl md:text-5xl lg:text-6xl text-accent lowercase tracking-wide"
            >
              {c(content, "hero.titleSmall")}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-10 max-w-md text-base md:text-lg text-white/75 leading-relaxed"
            >
              AI-студия продающего контента. Фото, видео-обложки и инфографика
              для Wildberries, Ozon и Яндекс.Маркет. Создавай 50+ кадров за
              минуты вместо недель съёмок.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <Link href="/auth/register" className="btn-accent">
                  Попробовать бесплатно
                  <span className="ml-1">→</span>
                </Link>
              </Magnetic>
              <Link href="/auth/login" className="btn-ghost">
                Войти
              </Link>
            </motion.div>
          </div>

          {/* Центральное фото героини */}
          <div className="lg:col-span-4 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto aspect-[3/4] w-full max-w-[460px]"
            >
              {/* Свечение позади */}
              <div className="absolute -inset-8 bg-[radial-gradient(closest-side,rgba(255,107,26,0.45),transparent_70%)] blur-2xl" />
              <div className="relative h-full w-full overflow-hidden rounded-[36px]">
                <Image
                  src={HERO_IMAGE}
                  alt="JOOZ.ai Studio"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 460px"
                />
                {/* Тёплая тонировка */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-base/60 via-transparent to-transparent" />
                <div className="absolute inset-0 mix-blend-color bg-[radial-gradient(ellipse_at_center,rgba(255,107,26,0.35),rgba(180,40,10,0.2))]" />
                <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
              </div>

              {/* TV-decor по бокам */}
              <div className="absolute -left-6 bottom-10 w-20 h-16 rounded-md border border-white/20 bg-black/60 backdrop-blur-md overflow-hidden rotate-[-6deg] hidden lg:block">
                <div className="scanlines absolute inset-0 animate-tv-flicker bg-gradient-to-br from-teal/40 to-bg-base/60" />
              </div>
              <div className="absolute -right-4 top-1/2 w-16 h-12 rounded-md border border-white/20 bg-black/60 backdrop-blur-md overflow-hidden rotate-[8deg] hidden lg:block">
                <div className="scanlines absolute inset-0 animate-tv-flicker bg-gradient-to-br from-accent/30 to-bg-base/70" />
              </div>
            </motion.div>
          </div>

          {/* Stat-карточки справа */}
          <div className="lg:col-span-3 flex flex-col gap-3 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="font-display text-sm uppercase tracking-[0.2em] text-teal whitespace-pre-line leading-relaxed"
            >
              {c(content, "hero.tagline")}
            </motion.div>

            {[
              { v: 50000, suffix: "+", label: c(content, "hero.stat1.label"), delay: 0.7 },
              { v: 1000, suffix: "+", label: c(content, "hero.stat2.label"), delay: 0.85 },
              { v: 3, suffix: "+", label: c(content, "hero.stat3.label"), delay: 1.0 },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: s.delay, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card p-5"
              >
                <div className="font-display text-4xl lg:text-5xl text-accent font-bold leading-none">
                  <AnimatedCounter end={s.v} suffix={s.suffix} />
                </div>
                <p className="mt-2.5 text-[13px] text-white/75 leading-snug">{s.label}</p>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-2 flex items-center gap-2 text-[11px] uppercase font-mono tracking-[0.2em] text-accent"
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-accent animate-glow-pulse" />
              {c(content, "hero.footnote")}
            </motion.div>
          </div>
        </div>
      </Spotlight>
    </section>
  );
}
