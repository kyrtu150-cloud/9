"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Upload, Download, X } from "lucide-react";

const STEPS = [
  {
    Icon: Upload,
    title: "1. Опиши задачу",
    text: "Выбери инструмент в меню слева, опиши товар в промте и добавь фото-референс, если есть. Выбери стиль и формат кадра.",
  },
  {
    Icon: Wand2,
    title: "2. Утверди hero-кадр",
    text: "Первый кадр стоит 1 кредит. Понравился — утверждай, и студия соберёт всю серию в едином стиле. Нет — перегенерируй.",
  },
  {
    Icon: Download,
    title: "3. Скачай и продавай",
    text: "Готовые кадры скачиваются по одному или все сразу. Вся история хранится в «Проектах» — можно повторить любой промт.",
  },
];

/** Тур из 3 шагов при первом входе в ЛК. Показывается один раз (localStorage). */
export function OnboardingTour() {
  const [step, setStep] = useState<number | null>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem("jooz_tour_done")) setStep(0);
    } catch {
      /* приватный режим — просто не показываем тур */
    }
  }, []);

  function finish() {
    try {
      localStorage.setItem("jooz_tour_done", "1");
    } catch {}
    setStep(null);
  }

  if (step === null) return null;
  const s = STEPS[step];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] bg-bg-base/80 backdrop-blur-md grid place-items-center p-6"
      >
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="glass-card w-full max-w-md p-8 text-center relative"
        >
          <button
            onClick={finish}
            aria-label="Пропустить тур"
            className="absolute top-4 right-4 h-9 w-9 rounded-full border border-white/15 grid place-items-center text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mx-auto h-16 w-16 rounded-full bg-accent/15 border border-accent/40 grid place-items-center mb-5">
            <s.Icon className="h-7 w-7 text-accent" />
          </div>
          <h2 className="text-display text-xl text-white">{s.title}</h2>
          <p className="mt-3 text-white/70 leading-relaxed">{s.text}</p>

          <div className="mt-6 flex items-center justify-center gap-2">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === step ? "w-8 bg-accent" : "w-1.5 bg-white/25"}`}
              />
            ))}
          </div>

          <div className="mt-6 flex gap-3 justify-center">
            {step < STEPS.length - 1 ? (
              <>
                <button onClick={finish} className="btn-ghost text-sm">Пропустить</button>
                <button onClick={() => setStep(step + 1)} className="btn-accent text-sm">Дальше →</button>
              </>
            ) : (
              <button onClick={finish} className="btn-accent text-sm">
                Начать творить 🚀
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
