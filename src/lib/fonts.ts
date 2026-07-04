import { Manrope, Oswald, Unbounded, JetBrains_Mono } from "next/font/google";

// Display: Unbounded — широкий мощный гротеск с кириллицей,
// ближайший бесплатный аналог Druk Wide Cyr из ТЗ
export const fontDisplay = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

// Heading: Oswald — узкий конденсированный, для подзаголовков и крупных цифр
export const fontHeading = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

// Body
export const fontSans = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Цифры / акценты
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = [
  fontDisplay.variable,
  fontHeading.variable,
  fontSans.variable,
  fontMono.variable,
].join(" ");
