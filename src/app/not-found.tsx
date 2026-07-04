import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="min-h-screen relative isolate overflow-hidden bg-bg-base grid place-items-center p-6">
      <div aria-hidden className="absolute inset-0 sunset-bg opacity-60" />
      <div className="relative text-center">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="text-numeric text-[8rem] lg:text-[12rem] leading-none text-accent/25">404</div>
        <h1 className="text-display text-2xl lg:text-4xl text-white -mt-6">Кадр не найден</h1>
        <p className="mt-4 text-white/65 max-w-sm mx-auto">
          Такой страницы нет — но есть студия, где можно сгенерировать что угодно.
        </p>
        <div className="mt-8 flex gap-3 justify-center flex-wrap">
          <Link href="/" className="btn-accent">На главную</Link>
          <Link href="/app" className="btn-ghost">В студию</Link>
        </div>
      </div>
    </div>
  );
}
