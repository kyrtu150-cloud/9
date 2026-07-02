import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem", xl: "3rem" },
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        bg: {
          base: "#0A0705",
          secondary: "#1A0F0A",
          tertiary: "#241612",
        },
        accent: {
          DEFAULT: "#FF6B1A",
          hover: "#FF8A3D",
          deep: "#D1500F",
          glow: "rgba(255,107,26,0.4)",
        },
        teal: {
          DEFAULT: "#2DD4BF",
          soft: "#5EEAD4",
        },
        card: {
          bg: "rgba(20,12,8,0.55)",
          border: "rgba(255,107,26,0.25)",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#B8B8B8",
          muted: "#6B6B6B",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "28px",
        pill: "999px",
      },
      boxShadow: {
        accent: "0 30px 80px rgba(255,107,26,0.15)",
        "accent-strong": "0 30px 100px rgba(255,107,26,0.35)",
        "card-inset": "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        "gradient-sunset":
          "linear-gradient(180deg, #1A0F0A 0%, #FF6B1A 65%, #0A0705 100%)",
        "gradient-radial-accent":
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,107,26,0.35), transparent 60%)",
        noise:
          "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "border-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.8" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "tv-flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.92" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s ease-out",
        "accordion-up": "accordion-up 0.3s ease-out",
        "border-spin": "border-spin 6s linear infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        "tv-flicker": "tv-flicker 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
