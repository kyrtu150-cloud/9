import Link from "next/link";
import { requireUser } from "@/lib/require-user";
import { Folder } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { user } = await requireUser({
    include: {
      projects: {
        orderBy: { createdAt: "desc" },
        include: { images: { take: 1, orderBy: { createdAt: "asc" } }, _count: { select: { images: true } } },
      },
    },
  });
  const projects = user.projects ?? [];

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/85">Архив</div>
        <h1 className="mt-2 font-display text-4xl lg:text-5xl uppercase text-white">Мои проекты</h1>
        <p className="mt-2 text-white/65">История всех генераций. Открывайте, скачивайте, повторяйте.</p>
      </header>

      {projects.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((p: any) => (
            <Link
              key={p.id}
              href={`/app/projects/${p.id}`}
              className="group glass-card overflow-hidden hover:border-accent/55 transition-colors"
            >
              <div className="aspect-square bg-bg-secondary relative overflow-hidden">
                {p.images[0] ? (
                  <img src={p.images[0].url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-white/30">
                    <Folder className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 rounded-pill bg-bg-base/70 backdrop-blur px-3 py-1 text-[10px] font-mono uppercase text-accent">
                  {p.type}
                </div>
                <div className="absolute bottom-3 right-3 rounded-pill bg-bg-base/70 backdrop-blur px-3 py-1 text-[10px] font-mono text-white/70">
                  {p._count.images} кадров
                </div>
              </div>
              <div className="p-4">
                <div className="font-medium text-white truncate">{p.title}</div>
                <div className="mt-1 text-xs text-white/45">{new Date(p.createdAt).toLocaleString("ru-RU")}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Folder className="h-12 w-12 text-white/25 mx-auto" />
          <div className="mt-4 text-white/55">Пока пусто. Создайте первый проект.</div>
          <Link href="/app/cover" className="btn-accent mt-5 inline-flex">Запустить студию</Link>
        </div>
      )}
    </div>
  );
}
