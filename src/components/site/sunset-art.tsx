/**
 * Современный aurora-mesh арт в фирменной палитре (чёрный / оранж / неон-розовый).
 * Чистый CSS: ноль внешних запросов, грузится мгновенно.
 * Заменяется на брендовые фото, когда они будут готовы.
 */
export function AuroraArt({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#0c0508] ${className ?? ""}`}>
      {/* Живые градиентные блобы */}
      <div className="absolute -top-1/4 -left-1/4 h-3/4 w-3/4 rounded-full bg-[radial-gradient(circle,rgba(255,107,26,0.85),transparent_65%)] blur-3xl animate-blob-float" />
      <div className="absolute -bottom-1/4 -right-1/4 h-3/4 w-3/4 rounded-full bg-[radial-gradient(circle,rgba(255,46,138,0.85),transparent_65%)] blur-3xl animate-blob-float-slow" />
      <div className="absolute top-1/3 left-1/3 h-1/2 w-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,87,161,0.5),transparent_60%)] blur-2xl animate-blob-float" style={{ animationDelay: "-7s" }} />

      {/* Тонкая сетка для глубины */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Виньетка + сканлайны */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,5,8,0.7)_100%)]" />
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
    </div>
  );
}

/** Компактная градиентная плитка для кейсов/примеров — вместо стоковых фото. */
export function ArtTile({
  tone = "orange",
  label,
  className,
}: {
  tone?: "orange" | "pink" | "violet" | "warm" | "gray";
  label?: string;
  className?: string;
}) {
  const tones: Record<string, string> = {
    orange: "from-[#2b1005] via-[#d1500f] to-[#ff8a3d]",
    pink: "from-[#2b0a1c] via-[#d6136b] to-[#ff57a1]",
    violet: "from-[#170a2b] via-[#7c3aed] to-[#c4b5fd]",
    warm: "from-[#2b1005] via-[#ff6b1a] to-[#ff2e8a]",
    gray: "from-[#242424] via-[#3a3a3a] to-[#555]",
  };
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${tones[tone]} ${className ?? ""}`}>
      <div className="absolute inset-0 scanlines opacity-15" />
      <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
      {label && (
        <span className="absolute bottom-2 left-2 rounded-pill bg-bg-base/70 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white/85">
          {label}
        </span>
      )}
    </div>
  );
}

/** Обратная совместимость со старым именем. */
export const SunsetArt = AuroraArt;
