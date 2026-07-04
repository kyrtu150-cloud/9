import { Manrope, Oswald, Unbounded, JetBrains_Mono } from "next/font/google";

// Display: Oswald — узкий мощный гротеск (v1, ближе всего к макетам)
export const fontDisplay = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Heading: Unbounded — широкий бренд-акцент, точечно
export const fontHeading = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700"],
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
