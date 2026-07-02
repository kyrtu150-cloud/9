import { requireUser } from "@/lib/require-user";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { user } = await requireUser();

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-3xl">
      <header>
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/85">Профиль</div>
        <h1 className="mt-2 font-display text-4xl uppercase text-white">Настройки</h1>
      </header>

      <form action="/api/profile" method="post" className="glass-card p-7 space-y-4">
        <Field name="name" label="Имя" defaultValue={user?.name ?? ""} />
        <Field name="email" label="Email" defaultValue={user?.email ?? ""} disabled />
        <button className="btn-accent">Сохранить</button>
      </form>

      <form action="/api/profile/password" method="post" className="glass-card p-7 space-y-4">
        <h2 className="font-display text-xl uppercase text-white">Смена пароля</h2>
        <Field name="current" type="password" label="Текущий пароль" />
        <Field name="next" type="password" label="Новый пароль" />
        <button className="btn-accent">Обновить пароль</button>
      </form>

      <div className="glass-card p-7">
        <h2 className="font-display text-xl uppercase text-white">Привязка соцсетей</h2>
        <p className="text-white/65 text-sm mt-2">
          Подключите Яндекс или ВК, чтобы входить в один клик. Доступно на странице{" "}
          <a href="/auth/login" className="text-accent underline">входа</a>.
        </p>
      </div>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-white/55 font-mono">{label}</span>
      <input
        {...rest}
        className="mt-2 w-full rounded-pill border border-white/12 bg-white/[0.02] focus:border-accent/60 focus:bg-white/[0.04] transition-colors outline-none px-5 py-3 text-white placeholder:text-white/30 disabled:opacity-60"
      />
    </label>
  );
}
