/**
 * Собственный SVG-арт в стиле бренда: закатное небо, солнце,
 * стопка ретро-телевизоров с бирюзовыми помехами.
 * Ноль внешних запросов — грузится мгновенно, работает офлайн.
 * Заменяется на брендовые фото, когда они будут готовы.
 */
export function SunsetArt({ tvs = true, className }: { tvs?: boolean; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <svg
        viewBox="0 0 600 800"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="sa-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#140a06" />
            <stop offset="42%" stopColor="#3a1707" />
            <stop offset="62%" stopColor="#c2470e" />
            <stop offset="72%" stopColor="#ff6b1a" />
            <stop offset="82%" stopColor="#7a2f0c" />
            <stop offset="100%" stopColor="#160b05" />
          </linearGradient>
          <radialGradient id="sa-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd9b0" />
            <stop offset="45%" stopColor="#ff9a4d" />
            <stop offset="100%" stopColor="#ff6b1a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sa-screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0e3b3d" />
            <stop offset="55%" stopColor="#177a72" />
            <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="sa-screen2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#312017" />
            <stop offset="100%" stopColor="#ff8a3d" stopOpacity="0.5" />
          </linearGradient>
          <pattern id="sa-scan" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="2" fill="#000" opacity="0.28" />
          </pattern>
          <filter id="sa-blur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="34" />
          </filter>
        </defs>

        {/* Небо */}
        <rect width="600" height="800" fill="url(#sa-sky)" />

        {/* Солнце с ореолом */}
        <circle cx="300" cy="540" r="215" fill="url(#sa-sun)" opacity="0.65" filter="url(#sa-blur)" />
        <circle cx="300" cy="540" r="128" fill="url(#sa-sun)" />

        {/* Дюны на горизонте */}
        <path d="M0 590 Q140 552 300 578 T600 566 V800 H0 Z" fill="#170c06" opacity="0.85" />
        <path d="M0 646 Q180 610 360 640 T600 626 V800 H0 Z" fill="#0f0703" />

        {/* Пылинки в контровом свете */}
        {[
          [90, 300, 2.4], [160, 210, 1.6], [468, 250, 2], [520, 380, 1.4],
          [70, 470, 1.8], [540, 500, 2.2], [220, 150, 1.2], [390, 130, 1.7],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#ffb37a" opacity="0.5" />
        ))}

        {tvs && (
          <g>
            {/* Нижний ТВ */}
            <g>
              <rect x="140" y="612" width="320" height="172" rx="14" fill="#1d110a" stroke="#ffffff26" />
              <rect x="162" y="632" width="212" height="132" rx="8" fill="url(#sa-screen)" />
              <rect x="162" y="632" width="212" height="132" rx="8" fill="url(#sa-scan)" />
              <rect x="140" y="612" width="5" height="172" rx="2" fill="#ff6b1a" opacity="0.4" />
              <circle cx="416" cy="668" r="10" fill="#0e0805" stroke="#ffffff2e" />
              <circle cx="416" cy="706" r="10" fill="#0e0805" stroke="#ffffff2e" />
              <rect x="398" y="736" width="40" height="7" rx="3" fill="#0e0805" />
            </g>
            {/* Средний ТВ */}
            <g>
              <rect x="172" y="474" width="256" height="146" rx="12" fill="#241410" stroke="#ffffff26" />
              <rect x="192" y="492" width="164" height="110" rx="7" fill="url(#sa-screen2)" />
              <rect x="192" y="492" width="164" height="110" rx="7" fill="url(#sa-scan)" />
              <rect x="172" y="474" width="4" height="146" rx="2" fill="#ff8a3d" opacity="0.45" />
              <circle cx="398" cy="524" r="8" fill="#120a06" stroke="#ffffff2e" />
              <circle cx="398" cy="554" r="8" fill="#120a06" stroke="#ffffff2e" />
            </g>
            {/* Верхний маленький ТВ с антенной */}
            <g>
              <line x1="280" y1="392" x2="236" y2="318" stroke="#e8e0d8" strokeWidth="2.5" opacity="0.6" />
              <line x1="296" y1="392" x2="352" y2="326" stroke="#e8e0d8" strokeWidth="2.5" opacity="0.6" />
              <rect x="212" y="388" width="176" height="94" rx="10" fill="#1a0e08" stroke="#ffffff26" />
              <rect x="228" y="402" width="112" height="66" rx="6" fill="url(#sa-screen)" />
              <rect x="228" y="402" width="112" height="66" rx="6" fill="url(#sa-scan)" />
              <circle cx="366" cy="420" r="7" fill="#0e0805" stroke="#ffffff2e" />
              <circle cx="366" cy="446" r="7" fill="#0e0805" stroke="#ffffff2e" />
            </g>
          </g>
        )}
      </svg>

      {/* Живость: мерцание помех + сканлайны поверх */}
      <div className="absolute inset-0 scanlines opacity-20 animate-tv-flicker pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-base/50 via-transparent to-bg-base/25 pointer-events-none" />
    </div>
  );
}

/** Компактная градиентная плитка для кейсов/примеров — вместо стоковых фото. */
export function ArtTile({
  tone = "orange",
  label,
  className,
}: {
  tone?: "orange" | "teal" | "warm" | "gray";
  label?: string;
  className?: string;
}) {
  const tones: Record<string, string> = {
    orange: "from-[#3a1707] via-[#c2470e] to-[#ff8a3d]",
    teal: "from-[#0e2b2d] via-[#177a72] to-[#2DD4BF]",
    warm: "from-[#241410] via-[#7a2f0c] to-[#ffb37a]",
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
