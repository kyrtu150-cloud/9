"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Check, Sparkles, Zap, Crown, Plus } from "lucide-react";
import type { Content } from "@/lib/content";
import { c } from "@/lib/content";
import { formatPrice } from "@/lib/utils";

type Plan = {
  id: string;
  name: string;
  Icon: typeof Zap;
  monthly: number;
  yearly: number;
  credits: number;
  highlight?: boolean;
  features: string[];
};

const PLANS: Plan[] = [
  {
    id: "start",
    name: "Start",
    Icon: Sparkles,
    monthly: 1990,
    yearly: 19104,
    credits: 50,
    features: [
      "50 кредитов в месяц",
      "Генерация обложек (10 фото)",
      "1 активный проект",
      "Стандартная очередь",
      "Email-поддержка",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    Icon: Zap,
    monthly: 4990,
    yearly: 47904,
    credits: 200,
    highlight: true,
    features: [
      "200 кредитов в месяц",
      "Все режимы студии",
      "Безлимит проектов",
      "Видео-обложки и инфографика",
      "Приоритетная очередь",
      "Чат-поддержка",
    ],
  },
  {
    id: "business",
    name: "Business",
    Icon: Crown,
    monthly: 12990,
    yearly: 124704,
    credits: 800,
    features: [
      "800 кредитов в месяц",
      "Командный доступ (5 мест)",
      "API + Webhooks",
      "White-label экспорт",
      "Персональный менеджер",
      "SLA 24/7",
    ],
  },
];

const CREDIT_PACKS = [
  { credits: 50, price: 590 },
  { credits: 200, price: 1990 },
  { credits: 500, price: 4490 },
  { credits: 1000, price: 7990 },
];

export function Pricing({ content }: { content: Content }) {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative isolate py-24 lg:py-32">
      <div aria-hidden className="absolute inset-0 sunset-bg opacity-60" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-bg-base/0 via-bg-base/40 to-bg-base" />

      <div className="container-wide relative">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="h-section"
          >
            <span className="block text-white">{c(content, "pricing.title.line1")}</span>
            <span className="block text-accent">{c(content, "pricing.title.line2")}</span>
          </motion.h2>

          {/* Toggle */}
          <div className="rounded-pill border border-white/15 bg-white/[0.04] backdrop-blur-xl p-1 flex items-center text-sm font-medium">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-pill transition-all ${!yearly ? "bg-accent text-bg-base" : "text-white/70 hover:text-white"}`}
            >
              {c(content, "pricing.toggle.month")}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-pill transition-all ${yearly ? "bg-accent text-bg-base" : "text-white/70 hover:text-white"}`}
            >
              {c(content, "pricing.toggle.year")}
            </button>
          </div>
        </div>

        <p className="mt-4 text-white/65 max-w-xl">{c(content, "pricing.subtitle")}</p>

        {/* План-карты */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan, i) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className={`group relative glass-card p-7 lg:p-8 flex flex-col ${
                plan.highlight ? "lg:scale-[1.03] glow-border animate-glow-pulse" : ""
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-wider text-bg-base">
                  Популярный
                </span>
              )}

              <div className="flex items-center justify-between">
                <div className="grid place-items-center h-12 w-12 rounded-full border border-accent/35 bg-accent/8">
                  <plan.Icon className="h-5 w-5 text-accent" />
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-white/45">
                  {plan.credits} кредитов
                </div>
              </div>

              <h3 className="mt-5 font-display text-3xl uppercase text-white">{plan.name}</h3>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-5xl text-white">
                  {formatPrice(yearly ? Math.round(plan.yearly / 12) : plan.monthly)}
                </span>
                <span className="text-white/55 text-sm">/мес</span>
              </div>
              {yearly && (
                <div className="text-xs text-accent mt-1">
                  Оплата сразу: {formatPrice(plan.yearly)}
                </div>
              )}

              <ul className="mt-7 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/75">
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/auth/register?plan=${plan.id}`}
                className={`mt-8 inline-flex items-center justify-center rounded-pill px-6 py-3 font-medium transition-all ${
                  plan.highlight
                    ? "bg-accent text-bg-base hover:bg-accent-hover hover:shadow-accent-strong"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                Выбрать {plan.name}
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Докупка кредитов */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12 glass-card p-7 lg:p-10"
        >
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-accent/80">
                + бонус
              </div>
              <h3 className="mt-2 font-display uppercase text-2xl lg:text-3xl text-white">
                Докупка кредитов
              </h3>
              <p className="mt-2 text-white/65 text-sm max-w-md">
                Не хватило кредитов внутри текущего тарифа? Докупайте пачками без смены подписки.
              </p>
            </div>
            <div className="rounded-pill border border-white/15 px-4 py-2 text-xs font-mono uppercase text-white/65">
              Разовая оплата
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {CREDIT_PACKS.map((p) => (
              <button
                key={p.credits}
                className="relative group rounded-2xl border border-white/10 hover:border-accent/60 bg-white/[0.02] hover:bg-accent/8 transition-all p-5 text-left"
              >
                <div className="flex items-center gap-2 text-accent">
                  <Plus className="h-4 w-4" />
                  <span className="font-display text-2xl">{p.credits}</span>
                  <span className="text-xs uppercase tracking-wider text-white/55 ml-auto">кредитов</span>
                </div>
                <div className="mt-3 font-display text-xl text-white">{formatPrice(p.price)}</div>
                <div className="mt-1 text-xs text-white/45">≈ {formatPrice(Math.round(p.price / p.credits))} за кадр</div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
