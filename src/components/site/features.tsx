"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, Layers, Film, BarChart3, Star, ArrowUpRight } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import type { Content } from "@/lib/content";
import { c } from "@/lib/content";

const FEATURE_IMAGE =
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1200&q=80";

const STYLE_CHIPS = ["Pinterest/Instagram", "Каталог", "Имидж", "Бренд"];

export function Features({ content }: { content: Content }) {
  const cards = [
    {
      Icon: Camera,
      kicker: c(content, "features.card1.kicker"),
      title: c(content, "features.card1.title"),
      text: c(content, "features.card1.text"),
    },
    {
      Icon: Layers,
      kicker: c(content, "features.card2.kicker"),
      title: c(content, "features.card2.title"),
      text: c(content, "features.card2.text"),
      chips: STYLE_CHIPS,
    },
    {
      Icon: Film,
      kicker: c(content, "features.card3.kicker"),
      title: c(content, "features.card3.title"),
      text: c(content, "features.card3.text"),
    },
    {
      Icon: BarChart3,
      kicker: c(content, "features.card4.kicker"),
      title: c(content, "features.card4.title"),
      text: c(content, "features.card4.text"),
    },
  ];

  return (
    <section id="features" className="relative isolate py-24 lg:py-36">
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-bg-base via-bg-secondary to-bg-base" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div aria-hidden className="absolute inset-0 sunset-bg opacity-50" />

      <Spotlight className="relative container-wide" size={700}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Левая колонка: заголовок + bento */}
          <div className="lg:col-span-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="h-section"
            >
              <span className="block text-white">{c(content, "features.title.line1")}</span>
              <span className="block text-accent">{c(content, "features.title.line2")}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-xl text-white/70 leading-relaxed"
            >
              {c(content, "features.subtitle")}
            </motion.p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {cards.map((card, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 40, rotateY: 8 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4 }}
                  className="glass-card p-6 lg:p-7 group hover:border-accent/55 transition-colors duration-500"
                >
                  <div className="flex items-start gap-5">
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 rounded-full bg-accent/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative grid place-items-center h-14 w-14 rounded-full border border-accent/40 bg-gradient-to-br from-accent/15 to-accent/0">
                        <card.Icon className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent/85">
                        {card.kicker}
                      </div>
                      <h3 className="mt-1.5 font-display uppercase text-lg leading-tight text-white">
                        {card.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-5 text-[14px] leading-relaxed text-white/65">{card.text}</p>

                  {card.chips && (
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-white/45 mr-1">
                        4 стиля:
                      </span>
                      {card.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-pill border border-accent/40 bg-accent/8 px-3 py-1 text-xs text-accent hover:bg-accent/20 transition-colors cursor-default"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.article>
              ))}
            </div>

            {/* Bottom banner */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-4 glass-card p-5 lg:p-6 flex items-center gap-5"
            >
              <div className="relative shrink-0">
                <Star className="h-7 w-7 text-accent fill-accent" />
                <div className="absolute inset-0 blur-xl bg-accent/40 -z-10" />
              </div>
              <p className="text-sm md:text-[15px] text-white/80 leading-snug flex-1">
                {c(content, "features.banner")}
              </p>
              <button className="grid place-items-center h-11 w-11 rounded-full border border-accent/60 hover:bg-accent/15 transition-colors shrink-0">
                <ArrowUpRight className="h-5 w-5 text-accent" />
              </button>
            </motion.div>
          </div>

          {/* Правая колонка: вертикальное фото героини */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[3/5] w-full overflow-hidden rounded-[28px]"
            >
              <Image
                src={FEATURE_IMAGE}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent" />
              <div className="absolute inset-0 mix-blend-color bg-[radial-gradient(ellipse_at_center,rgba(255,107,26,0.4),rgba(190,50,15,0.25))]" />
              <div className="absolute inset-0 scanlines opacity-25 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </Spotlight>
    </section>
  );
}
