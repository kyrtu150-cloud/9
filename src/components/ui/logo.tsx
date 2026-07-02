import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="JOOZ.ai Studio" className={cn("group inline-flex items-center", className)}>
      <div className="flex items-baseline gap-1 rounded-pill border border-white/12 bg-white/[0.03] backdrop-blur-xl px-5 py-2.5 transition-colors duration-300 group-hover:border-white/25">
        <span className="font-display text-2xl font-bold tracking-tight text-white leading-none">
          JOOZ
        </span>
        <span className="font-display text-2xl font-bold tracking-tight leading-none text-white">.</span>
        <span className="font-display text-lg font-semibold text-accent leading-none -ml-0.5">ai</span>
        <span className="ml-2 text-[10px] font-mono uppercase tracking-[0.4em] text-white/55">
          studio
        </span>
      </div>
    </Link>
  );
}
