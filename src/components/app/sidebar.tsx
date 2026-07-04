"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const SECTIONS: { title: string; items: { href: string; label: string; index: string }[] }[] = [
  {
    title: "Студия",
    items: [
      { href: "/app", label: "Дашборд", index: "00" },
      { href: "/app/cover", label: "Обложка", index: "01" },
      { href: "/app/funnel", label: "Фотоворонка", index: "02" },
      { href: "/app/video", label: "Видео", index: "03" },
      { href: "/app/infographic", label: "Инфографика", index: "04" },
    ],
  },
  {
    title: "Аккаунт",
    items: [
      { href: "/app/projects", label: "Проекты", index: "→" },
      { href: "/app/billing", label: "Биллинг", index: "→" },
      { href: "/app/settings", label: "Профиль", index: "→" },
      { href: "/app/support", label: "Поддержка", index: "→" },
    ],
  },
];

export function AppSidebar({
  user,
}: {
  user: { name?: string | null; email?: string | null; credits?: number; plan?: string };
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex sticky top-0 h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-bg-secondary/60 backdrop-blur-xl">
      <div className="p-5 border-b border-white/10">
        <Logo />
      </div>

      <div className="p-5">
        <div className="relative rounded-2xl p-[1px] bg-gradient-acid">
          <div className="rounded-2xl bg-bg-secondary p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-pink">Баланс</div>
            <div className="mt-1 text-numeric text-3xl text-white">
              {user.credits ?? 0} <span className="text-base text-white/55 font-sans font-normal">кредитов</span>
            </div>
            <div className="mt-1 text-xs text-white/60">
              Тариф: <span className="uppercase text-white">{user.plan ?? "free"}</span>
            </div>
            <Link href="/app/billing" className="mt-3 inline-block text-xs text-acid font-semibold hover:brightness-125">
              + Докупить кредиты
            </Link>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="px-3 mb-2 text-[10px] uppercase tracking-[0.25em] font-mono text-white/40">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active =
                  pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-baseline gap-3 px-3 py-2.5 rounded-xl text-sm transition-all border",
                      active
                        ? "bg-pink/10 text-white border-pink/35"
                        : "text-white/70 hover:bg-white/[0.04] hover:text-white border-transparent"
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-[10px] w-5 shrink-0",
                        active ? "text-pink" : "text-white/30 group-hover:text-white/50"
                      )}
                    >
                      {item.index}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="h-9 w-9 rounded-full bg-gradient-acid grid place-items-center font-display text-white text-sm">
            {(user.name ?? user.email ?? "?").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-white truncate">{user.name ?? user.email}</div>
            <div className="text-xs text-white/45 truncate">{user.email}</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-xs text-white/50 hover:text-pink transition-colors whitespace-nowrap"
          >
            Выйти →
          </button>
        </div>
      </div>
    </aside>
  );
}
