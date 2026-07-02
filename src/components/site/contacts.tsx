"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { Magnetic } from "@/components/ui/magnetic";
import type { Content } from "@/lib/content";
import { c } from "@/lib/content";

const BG_IMG =
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1600&q=80";

export function Contacts({ content }: { content: Content }) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(form.entries())),
        headers: { "content-type": "application/json" },
      });
      setStatus(res.ok ? "ok" : "err");
      if (res.ok) (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("err");
    }
  }

  return (
    <section id="contacts" className="relative isolate py-24 lg:py-36 overflow-hidden">
      {/* Фон */}
      <div aria-hidden className="absolute inset-0">
        <Image src={BG_IMG} alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-bg-base/70" />
        <div className="absolute inset-0 sunset-bg opacity-70" />
        <div className="absolute inset-0 scanlines opacity-20" />
      </div>

      <div className="container-wide relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-section"
            >
              <span className="block text-white">{c(content, "contacts.title.line1")}</span>
              <span className="block text-accent">{c(content, "contacts.title.line2")}</span>
            </motion.h2>
            <p className="mt-5 text-white/80 max-w-lg text-lg">{c(content, "contacts.subtitle")}</p>

            <div className="mt-8">
              <Magnetic>
                <a href="/auth/register" className="btn-accent text-base">
                  {c(content, "contacts.cta")} →
                </a>
              </Magnetic>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ContactRow Icon={Mail} label="Email" value={c(content, "contacts.email")} href={`mailto:${c(content, "contacts.email")}`} />
              <ContactRow Icon={Phone} label="Телефон" value={c(content, "contacts.phone")} href={`tel:${c(content, "contacts.phone").replace(/\D/g, "")}`} />
              <ContactRow Icon={MessageCircle} label="Telegram" value="@jooz_ai" href="https://t.me/jooz_ai" />
              <ContactRow Icon={MapPin} label="Офис" value={c(content, "contacts.address")} />
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            onSubmit={onSubmit}
            className="lg:col-span-5 glass-card p-7 lg:p-9 space-y-4"
          >
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-accent/80">Быстрая заявка</div>
            <h3 className="font-display text-2xl text-white uppercase">Перезвоним за 15 минут</h3>

            <Field name="name" label="Имя" placeholder="Как к вам обращаться" required />
            <Field name="contact" label="Email или телефон" placeholder="vy@brand.ru" required />
            <Field name="message" label="Сообщение" placeholder="Расскажите про продукт и задачу" multiline />

            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-accent w-full justify-center disabled:opacity-60"
            >
              {status === "sending" ? "Отправляем..." : (
                <>
                  Отправить заявку <Send className="h-4 w-4" />
                </>
              )}
            </button>
            {status === "ok" && (
              <div className="text-sm text-emerald-400">
                Заявка принята! Свяжемся в течение 15 минут.
              </div>
            )}
            {status === "err" && (
              <div className="text-sm text-rose-400">Ошибка отправки. Попробуйте ещё раз.</div>
            )}
            <p className="text-[11px] text-white/45">
              Нажимая «Отправить», вы соглашаетесь с <a href="/legal/privacy" className="underline">политикой конфиденциальности</a>.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  Icon,
  label,
  value,
  href,
}: {
  Icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const Tag = (href ? "a" : "div") as "a";
  return (
    <Tag
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="glass-card p-4 flex items-center gap-4 hover:border-accent/55 transition-colors"
    >
      <div className="h-11 w-11 rounded-full border border-accent/35 bg-accent/10 grid place-items-center shrink-0">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-mono uppercase tracking-wider text-white/45">{label}</div>
        <div className="text-white truncate">{value}</div>
      </div>
    </Tag>
  );
}

function Field({
  name,
  label,
  placeholder,
  required,
  multiline,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-white/55 font-mono">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      {multiline ? (
        <textarea
          name={name}
          rows={3}
          required={required}
          placeholder={placeholder}
          className="mt-2 w-full rounded-2xl border border-white/12 bg-white/[0.02] focus:border-accent/60 focus:bg-white/[0.04] transition-colors outline-none px-4 py-3 text-white placeholder:text-white/30 resize-none"
        />
      ) : (
        <input
          name={name}
          type="text"
          required={required}
          placeholder={placeholder}
          className="mt-2 w-full rounded-pill border border-white/12 bg-white/[0.02] focus:border-accent/60 focus:bg-white/[0.04] transition-colors outline-none px-5 py-3 text-white placeholder:text-white/30"
        />
      )}
    </label>
  );
}
