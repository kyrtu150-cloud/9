"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
            "flex items-center justify-between gap-4 rounded-pill border border-white/12 bg-bg-base/55 backdrop-blur-2xl px-4 py-2.5 transition-all duration-500",
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
            <Magnetic>
              <Link href="/auth/register" className="btn-accent text-sm">
                {ctaLabel}
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </header>
  );
}
