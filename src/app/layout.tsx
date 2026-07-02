import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "JOOZ.ai Studio — продающий контент для маркетплейсов с ИИ",
  description:
    "AI-генерация фото, видео-обложек и инфографики для Wildberries, Ozon и Яндекс.Маркет. Создавай 50+ продающих кадров за минуты.",
  metadataBase: new URL("https://jooz.ai"),
  openGraph: {
    title: "JOOZ.ai Studio",
    description:
      "AI-студия для селлеров: фото, видео и инфографика, которые продают.",
    type: "website",
    locale: "ru_RU",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0705",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={fontVariables} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <div className="noise-overlay" aria-hidden />
      </body>
    </html>
  );
}
