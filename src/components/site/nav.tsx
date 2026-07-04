"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Magnetic } from "@/components/ui/magnetic";
import { cn } from "@/lib/utils";

const items = [
  { id: "features", label: "Возможности" },
  { id: "process", label: "Процесс" },
  { id: "cases", label: "Примеры" },
  { id: "pricing", label: "Тарифы" },
];

export function Nav({ ctaLabel = "Попробовать бесплатно", loginLabel = "Войти" }: { ctaLabel?: string; loginLabel?: string }) {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      io.disconnect();
    };
  }, []);

  // Блокировка скролла под мобильным меню
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div className="container-wide">
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-pill border border-white/12 bg-bg-base/60 backdrop-blur-xl px-4 py-2.5 transition-all duration-500",
            scrolled && "border-white/20 shadow-accent"
          )}
        >
          <Logo />

          <nav className="hidden lg:flex items-center gap-2">
            {items.map((item) => {
              const isActive = active === item.id;
              return (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className="relative px-4 py-2 text-sm font-medium text-white/70 transition-colors duration-300 hover:text-white"
                >
                  <span className={cn(isActive && "text-accent")}>{item.label}</span>
                  {isActive && (
                    <span className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 h-1 w-1 rounded-full bg-accent shadow-[0_0_8px_2px_rgba(255,107,26,0.7)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white/85 hover:text-white transition-colors"
            >
              {loginLabel}
            </Link>
            <Magnetic className="hidden sm:block">
              <Link href="/auth/register" className="btn-accent text-sm">
                {ctaLabel}
              </Link>
            </Magnetic>
            {/* Бургер для мобилок */}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
              className="lg:hidden grid place-items-center h-10 w-10 rounded-full border border-white/15 text-white hover:bg-white/10 transition-colors"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {open && (
        <div className="lg:hidden fixed inset-0 top-0 -z-10 bg-bg-base/95 backdrop-blur-2xl pt-28 px-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-5 py-4 text-lg font-medium text-white/85 hover:bg-white/5 hover:text-accent transition-colors border border-transparent hover:border-white/10"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/auth/register" onClick={() => setOpen(false)} className="btn-accent justify-center">
                {ctaLabel}
              </Link>
              <Link href="/auth/login" onClick={() => setOpen(false)} className="btn-ghost justify-center">
                {loginLabel}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
