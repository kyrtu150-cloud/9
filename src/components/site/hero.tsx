"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Magnetic } from "@/components/ui/magnetic";
import { Spotlight } from "@/components/ui/spotlight";
import { SunsetArt } from "@/components/site/sunset-art";
import type { Content } from "@/lib/content";
import { c } from "@/lib/content";

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

      <Spotlight className="relative container-wide pt-6 lg:pt-14" size={800}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Текстовый блок слева */}
          <div className="lg:col-span-5 relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-display text-[16vw] sm:text-[12vw] lg:text-[8.5vw] xl:text-[7.5rem] text-white leading-[0.9]"
            >
              {c(content, "hero.titleLarge")}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="mt-3 font-display font-medium text-2xl md:text-4xl lg:text-5xl text-accent lowercase tracking-wide"
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

          {/* Центральный арт: закат + ретро-ТВ */}
          <div className="lg:col-span-4 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto aspect-[3/4] w-full max-w-[460px]"
            >
              {/* Свечение позади */}
              <div className="absolute -inset-8 bg-[radial-gradient(closest-side,rgba(255,107,26,0.45),transparent_70%)] blur-2xl" />
              <SunsetArt className="relative h-full w-full rounded-[36px] border border-white/10" />
            </motion.div>
          </div>

          {/* Stat-карточки справа */}
          <div className="lg:col-span-3 flex flex-col gap-3 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="font-mono text-xs uppercase tracking-[0.25em] text-teal whitespace-pre-line leading-relaxed"
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
                <div className="text-numeric text-4xl lg:text-5xl text-accent leading-none">
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
