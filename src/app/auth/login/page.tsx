"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(data.get("email")),
      password: String(data.get("password")),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Неверный email или пароль");
    } else {
      router.push(params.get("callbackUrl") || "/app");
    }
  }

  return (
    <AuthShell
      title="Вход в студию"
      subtitle="Войдите, чтобы продолжить генерацию"
      footer={
        <>
          Нет аккаунта?{" "}
          <Link href="/auth/register" className="text-accent hover:underline">
            Зарегистрироваться
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField name="email" type="email" label="Email" placeholder="vy@brand.ru" required />
        <AuthField name="password" type="password" label="Пароль" placeholder="••••••••" required />
        {error && <div className="text-sm text-rose-400">{error}</div>}
        <button type="submit" disabled={loading} className="btn-accent w-full justify-center">
          {loading ? "Входим..." : "Войти"}
        </button>

        <div className="flex items-center gap-3 text-xs text-white/40 font-mono uppercase tracking-wider">
          <div className="h-px flex-1 bg-white/10" />
          или
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <OAuthButtons />
        <div className="text-center">
          <Link href="/auth/forgot" className="text-xs text-white/55 hover:text-accent">
            Забыли пароль?
          </Link>
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

function OAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => signIn("yandex", { callbackUrl: "/app" })}
        className="btn-ghost text-sm justify-center"
      >
        Яндекс ID
      </button>
      <button
        type="button"
        onClick={() => signIn("vk", { callbackUrl: "/app" })}
        className="btn-ghost text-sm justify-center"
      >
        ВКонтакте
      </button>
    </div>
  );
}
