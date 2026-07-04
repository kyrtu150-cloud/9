"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Upload, Sparkles, Wand2, Download } from "lucide-react";
import type { Content } from "@/lib/content";
import { c } from "@/lib/content";

export function Process({ content }: { content: Content }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-72%"]);
  const lineX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const steps = [
    { n: "01", Icon: Upload, title: c(content, "process.step1.title"), text: c(content, "process.step1.text") },
    { n: "02", Icon: Sparkles, title: c(content, "process.step2.title"), text: c(content, "process.step2.text") },
    { n: "03", Icon: Wand2, title: c(content, "process.step3.title"), text: c(content, "process.step3.text") },
    { n: "04", Icon: Download, title: c(content, "process.step4.title"), text: c(content, "process.step4.text") },
  ];

  return (
    <section id="process" ref={ref} className="relative isolate h-[320svh] bg-bg-base">
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <div aria-hidden className="absolute inset-0 sunset-bg opacity-30" />

        <div className="container-wide pt-28">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="h-section"
              >
                <span className="block text-white">{c(content, "process.title.line1")}</span>
                <span className="block text-accent">{c(content, "process.title.line2")}</span>
              </motion.h2>
              <p className="mt-4 text-white/65 max-w-md">{c(content, "process.subtitle")}</p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-white/45">
              <span>Скролл →</span>
              <div className="h-px w-24 bg-white/15" />
            </div>
          </div>
        </div>

        {/* Прогресс-линия */}
        <div className="container-wide mt-8 mb-2">
          <div className="relative h-px w-full bg-white/10 overflow-hidden">
            <motion.div
              style={{ width: lineX }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent/70 via-accent to-accent-hover shadow-[0_0_20px_2px_rgba(255,107,26,0.7)]"
            />
          </div>
        </div>

        {/* Horizontal scrolling steps */}
        <div className="flex-1 flex items-center">
          <motion.div style={{ x }} className="flex gap-6 lg:gap-10 pl-5 lg:pl-10 pr-10">
            {steps.map((step, i) => (
              <div
                key={i}
                className="glass-card relative shrink-0 w-[78vw] sm:w-[60vw] lg:w-[44vw] xl:w-[38vw] p-8 lg:p-12 group overflow-hidden"
              >
                <div
                  aria-hidden
                  className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-accent/15 blur-3xl group-hover:bg-accent/25 transition-colors duration-700"
                />
                <div className="relative">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-numeric text-[7rem] lg:text-[9rem] leading-none text-accent/15">
                      {step.n}
                    </span>
                    <step.Icon className="h-10 w-10 text-accent shrink-0" />
                  </div>
                  <h3 className="mt-4 text-display text-2xl lg:text-3xl text-white">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-white/65 max-w-md leading-relaxed">{step.text}</p>

                  {/* Превью-плашки */}
                  <div className="mt-8 flex items-center gap-3">
                    {[0, 1, 2].map((j) => (
                      <div
                        key={j}
                        className="h-20 w-20 rounded-2xl bg-gradient-to-br from-accent/20 to-bg-tertiary border border-accent/25 grid place-items-center"
                      >
                        <step.Icon className="h-7 w-7 text-accent/60" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
