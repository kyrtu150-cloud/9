"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      password: fd.get("password"),
    };
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Ошибка регистрации");
      setLoading(false);
      return;
    }
    const signedIn = await signIn("credentials", {
      email: String(payload.email),
      password: String(payload.password),
      redirect: false,
    });
    setLoading(false);
    if (signedIn?.error) {
      router.push("/auth/login");
    } else {
      router.push("/app");
    }
  }

  return (
    <AuthShell
      title="Регистрация"
      subtitle="После регистрации сразу +10 бесплатных кредитов на счёт"
      footer={
        <>
          Уже есть аккаунт?{" "}
          <Link href="/auth/login" className="text-accent hover:underline">
            Войти
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField name="name" label="Имя" placeholder="Как вас зовут" required />
        <AuthField name="email" type="email" label="Email" placeholder="vy@brand.ru" required />
        <AuthField name="password" type="password" label="Пароль (от 8 символов)" placeholder="••••••••" required minLength={8} />
        {error && <div className="text-sm text-rose-400">{error}</div>}
        <button type="submit" disabled={loading} className="btn-accent w-full justify-center">
          {loading ? "Создаём аккаунт..." : "Создать и войти"}
        </button>

        <p className="text-[11px] text-white/45">
          Нажимая «Создать», вы соглашаетесь с{" "}
          <Link href="/legal/offer" className="underline">офертой</Link> и{" "}
          <Link href="/legal/privacy" className="underline">политикой</Link>.
        </p>

        <div className="flex items-center gap-3 text-xs text-white/40 font-mono uppercase tracking-wider">
          <div className="h-px flex-1 bg-white/10" />
          или
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => signIn("yandex", { callbackUrl: "/app" })} className="btn-ghost text-sm justify-center">
            Яндекс ID
          </button>
          <button type="button" onClick={() => signIn("vk", { callbackUrl: "/app" })} className="btn-ghost text-sm justify-center">
            ВКонтакте
          </button>
        </div>
      </form>
    </AuthShell>
  );
}

function AuthField(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-white/55 font-mono">{label}</span>
      <input
        {...rest}
        className="mt-2 w-full rounded-pill border border-white/12 bg-white/[0.02] focus:border-accent/60 focus:bg-white/[0.04] transition-colors outline-none px-5 py-3 text-white placeholder:text-white/30"
      />
    </label>
  );
}
