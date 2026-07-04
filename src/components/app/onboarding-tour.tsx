"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  {
    index: "01",
    title: "Опиши задачу",
    text: "Выбери инструмент в меню слева, опиши товар в промт-баре снизу. Можно добавить фото-референс, стиль и формат кадра.",
  },
  {
    index: "02",
    title: "Утверди hero-кадр",
    text: "Первый кадр стоит 1 кредит. Понравился — утверждай, и студия соберёт всю серию в едином стиле. Нет — перегенерируй.",
  },
  {
    index: "03",
    title: "Скачай и продавай",
    text: "Кадры скачиваются по одному или все сразу. История — в «Проектах»: любой промт можно повторить в один клик.",
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
            className="absolute top-4 right-4 text-white/50 hover:text-white text-lg"
          >
            ✕
          </button>

          <div className="text-numeric text-6xl text-acid">{s.index}</div>
          <h2 className="mt-3 text-display text-2xl text-white">{s.title}</h2>
          <p className="mt-3 text-white/70 leading-relaxed">{s.text}</p>

          <div className="mt-6 flex items-center justify-center gap-2">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === step ? "w-8 bg-gradient-acid" : "w-1.5 bg-white/25"}`}
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
                Начать творить →
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
