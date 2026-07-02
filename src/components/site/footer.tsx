"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import type { Content } from "@/lib/content";
import { c } from "@/lib/content";

const COL_NAV = [
  { label: "Возможности", href: "#features" },
  { label: "Процесс", href: "#process" },
  { label: "Примеры", href: "#cases" },
  { label: "Тарифы", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Контакты", href: "#contacts" },
];

const COL_LEGAL = [
  { label: "Публичная оферта", href: "/legal/offer" },
  { label: "Политика конфиденциальности", href: "/legal/privacy" },
  { label: "Пользовательское соглашение", href: "/legal/terms" },
];

const SOCIALS = [
  { label: "Telegram", href: "https://t.me/jooz_ai" },
  { label: "VK", href: "https://vk.com/jooz_ai" },
  { label: "YouTube", href: "https://youtube.com/@jooz_ai" },
];

export function SiteFooter({ content }: { content: Content }) {
  return (
    <footer className="relative isolate border-t border-white/10 bg-bg-base">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="container-wide py-16 grid grid-cols-2 lg:grid-cols-12 gap-10">
        <div className="col-span-2 lg:col-span-4">
          <Logo />
          <p className="mt-6 text-white/65 max-w-xs leading-relaxed">{c(content, "footer.tagline")}</p>

          <form
            className="mt-6 flex items-center gap-2 max-w-sm rounded-pill border border-white/15 bg-white/[0.02] p-1"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Спасибо, что подписались!");
            }}
          >
            <input
              type="email"
              required
              placeholder="email для новостей"
              className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none"
            />
            <button className="rounded-pill bg-accent text-bg-base text-sm font-medium px-4 py-2 hover:bg-accent-hover transition-colors">
              Подписаться
            </button>
          </form>
        </div>

        <FooterCol title="Навигация" items={COL_NAV} />
        <FooterCol title="Правовое" items={COL_LEGAL} />
        <FooterCol title="Соцсети" items={SOCIALS} external />
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide py-6 flex items-center justify-between gap-6 flex-wrap text-xs text-white/45">
          <div>{c(content, "footer.copyright")}</div>
          <div className="max-w-md text-right">{c(content, "footer.legal")}</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
  external,
}: {
  title: string;
  items: { label: string; href: string }[];
  external?: boolean;
}) {
  return (
    <div className="lg:col-span-2 lg:col-start-auto">
      <div className="font-mono text-xs uppercase tracking-[0.25em] text-accent/85">{title}</div>
      <ul className="mt-4 space-y-2">
        {items.map((i) => (
          <li key={i.label}>
            <Link
              href={i.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="text-white/75 hover:text-accent transition-colors text-sm"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
