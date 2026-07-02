"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Spotlight({
  className,
  children,
  size = 600,
  color = "rgba(255,107,26,0.18)",
}: {
  className?: string;
  children?: ReactNode;
  size?: number;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={cn("group relative", className)}
      onMouseMove={(e) => {
        const el = ref.current!;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        el.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }}
      style={
        {
          "--mx": "50%",
          "--my": "50%",
          backgroundImage: `radial-gradient(${size}px circle at var(--mx) var(--my), ${color}, transparent 70%)`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
