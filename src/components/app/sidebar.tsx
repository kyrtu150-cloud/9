"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Camera,
  Layers,
  Film,
  BarChart3,
  Folder,
  CreditCard,
  User,
  LifeBuoy,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const SECTIONS: { title: string; items: { href: string; label: string; Icon: typeof Camera }[] }[] = [
  {
    title: "Студия",
    items: [
      { href: "/app", label: "Дашборд", Icon: LayoutDashboard },
      { href: "/app/cover", label: "Обложка", Icon: Camera },
      { href: "/app/funnel", label: "Фотоворонка", Icon: Layers },
      { href: "/app/video", label: "Видео", Icon: Film },
      { href: "/app/infographic", label: "Инфографика", Icon: BarChart3 },
    ],
  },
  {
    title: "Аккаунт",
    items: [
      { href: "/app/projects", label: "Проекты", Icon: Folder },
      { href: "/app/billing", label: "Биллинг", Icon: CreditCard },
      { href: "/app/settings", label: "Профиль", Icon: User },
      { href: "/app/support", label: "Поддержка", Icon: LifeBuoy },
    ],
  },
];

export function AppSidebar({ user }: { user: { name?: string | null; email?: string | null; credits?: number; plan?: string } }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex sticky top-0 h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-bg-secondary/60 backdrop-blur-2xl">
      <div className="p-5 border-b border-white/10">
        <Logo />
      </div>

      <div className="p-5">
        <div className="rounded-2xl border border-accent/30 bg-accent/8 p-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Баланс
          </div>
          <div className="mt-1 font-display text-3xl text-white">
            {user.credits ?? 0} <span className="text-base text-white/55">кредитов</span>
          </div>
          <div className="mt-1 text-xs text-white/60">
            Тариф: <span className="uppercase text-white">{user.plan ?? "free"}</span>
          </div>
          <Link
            href="/app/billing"
            className="mt-3 inline-flex items-center gap-1 text-xs text-accent hover:underline"
          >
            + Докупить кредиты
          </Link>
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
                  pathname === item.href ||
                  (item.href !== "/app" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                      active
                        ? "bg-accent/15 text-accent border border-accent/30"
                        : "text-white/75 hover:bg-white/[0.04] hover:text-white border border-transparent"
                    )}
                  >
                    <item.Icon className="h-4 w-4" />
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
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent to-accent-deep grid place-items-center font-display text-bg-base">
            {(user.name ?? user.email ?? "?").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-white truncate">{user.name ?? user.email}</div>
            <div className="text-xs text-white/45 truncate">{user.email}</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="h-9 w-9 grid place-items-center rounded-lg text-white/55 hover:text-accent hover:bg-white/5"
            title="Выйти"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
