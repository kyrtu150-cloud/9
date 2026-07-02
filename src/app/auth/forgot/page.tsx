"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";

export default function ForgotPage() {
  const [done, setDone] = useState(false);
  return (
    <AuthShell
      title="Восстановить доступ"
      subtitle="Отправим ссылку для входа на ваш email"
      footer={
        <>
          Вспомнили пароль?{" "}
          <Link href="/auth/login" className="text-accent hover:underline">Войти</Link>
        </>
      }
    >
      {done ? (
        <div className="text-center">
          <div className="font-display text-2xl text-accent uppercase">Письмо отправлено</div>
          <p className="mt-3 text-white/70">Проверьте почту и кликните по ссылке для входа.</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
          className="space-y-4"
        >
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-white/55 font-mono">Email</span>
            <input
              type="email"
              required
              placeholder="vy@brand.ru"
              className="mt-2 w-full rounded-pill border border-white/12 bg-white/[0.02] focus:border-accent/60 focus:bg-white/[0.04] transition-colors outline-none px-5 py-3 text-white placeholder:text-white/30"
            />
          </label>
          <button className="btn-accent w-full justify-center">Отправить ссылку</button>
        </form>
      )}
    </AuthShell>
  );
}
