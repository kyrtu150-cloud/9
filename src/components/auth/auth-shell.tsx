import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative isolate overflow-hidden bg-bg-base">
      <div aria-hidden className="absolute inset-0 sunset-bg opacity-60" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_120%,rgba(255,107,26,0.45),transparent_60%)]" />

      <div className="relative container-wide pt-6 pb-12 flex flex-col min-h-screen">
        <header className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="text-sm text-white/70 hover:text-accent">← На главную</Link>
        </header>

        <div className="flex-1 grid place-items-center py-12">
          <div className="w-full max-w-md">
            <h1 className="font-display text-4xl lg:text-5xl uppercase text-white">{title}</h1>
            {subtitle && <p className="mt-3 text-white/65">{subtitle}</p>}

            <div className="mt-8 glass-card p-7 lg:p-9">{children}</div>

            {footer && <div className="mt-6 text-sm text-white/60">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
