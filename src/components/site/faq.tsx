"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Content } from "@/lib/content";
import { c } from "@/lib/content";

const ITEMS = [
  {
    q: "Сколько кредитов нужно на одну карточку?",
    a: "Полная фотоворонка (15 кадров) тратит 15 кредитов. Обложка для A/B-теста (10 кадров) — 10. Видео-обложка — 5. Инфографика — 3. На Pro-тарифе хватает на 13+ полных воронок в месяц.",
  },
  {
    q: "Откуда сервис берёт стиль фото?",
    a: "Вы загружаете 1-3 референса: товар или похожую съёмку. ИИ изучает свет, композицию и атрибуты, после чего предлагает направление. Утвердив главный кадр, вы запускаете генерацию всей серии в едином стиле.",
  },
  {
    q: "Можно ли использовать сгенерированные фото на маркетплейсах?",
    a: "Да. Все изображения принадлежат вам и подходят под требования Wildberries, Ozon и Яндекс.Маркет: разрешение 1200×1600+, чистый фон по запросу, экспорт в JPG/PNG/WebP.",
  },
  {
    q: "Что входит в стартовые 10 кредитов?",
    a: "После регистрации сразу доступно 10 бесплатных кредитов — это полноценная обложка или 2 видео-обложки. Карта не нужна, подписка не подключается автоматически.",
  },
  {
    q: "Как работает командный доступ на Business?",
    a: "До 5 пользователей в одной рабочей зоне, общая библиотека проектов, ролевая модель (Admin / Editor / Viewer) и единая биллинг-страница для бухгалтерии.",
  },
  {
    q: "Можно ли оплатить юр.лицом по счёту?",
    a: "Да, для тарифа Business доступна оплата по счёту с закрывающими документами и НДС. Напишите менеджеру в чате после регистрации.",
  },
  {
    q: "Что будет с моими данными и фотографиями?",
    a: "Все референсы и сгенерированные кадры хранятся в вашем кабинете и доступны только вам. Через 90 дней неактивные файлы перемещаются в холодное хранилище, проекты остаются.",
  },
  {
    q: "Есть ли возврат, если сервис не подойдёт?",
    a: "Да. В течение 7 дней с момента первой оплаты тарифа мы возвращаем 100% стоимости подписки, если кредиты не потрачены или израсходовано меньше 20%.",
  },
];

export function FAQ({ content }: { content: Content }) {
  return (
    <section id="faq" className="relative isolate py-24 lg:py-32">
      <div className="container-wide grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="h-section"
          >
            <span className="block text-white">{c(content, "faq.title.line1")}</span>
            <span className="block text-accent">{c(content, "faq.title.line2")}</span>
          </motion.h2>
          <p className="mt-4 text-white/65 max-w-md">{c(content, "faq.subtitle")}</p>
        </div>

        <div className="lg:col-span-7">
          <Accordion.Root type="single" collapsible className="space-y-3">
            {ITEMS.map((item, i) => (
              <Accordion.Item
                key={i}
                value={`q-${i}`}
                className="glass-card overflow-hidden group data-[state=open]:border-accent/55"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left">
                    <span className="font-medium text-base lg:text-lg text-white">{item.q}</span>
                    <span className="shrink-0 h-9 w-9 rounded-full border border-white/15 grid place-items-center transition-transform duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-accent group-data-[state=open]:border-accent">
                      <Plus className="h-4 w-4 text-white group-data-[state=open]:text-bg-base" />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <div className="px-6 pb-6 text-white/70 leading-relaxed">{item.a}</div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
}
