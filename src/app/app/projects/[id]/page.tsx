import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { ArrowLeft, Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const { session } = await requireUser();
  const project = await prisma.project.findFirst({
    where: { id: params.id, user: { email: session.user!.email! } },
    include: { images: { orderBy: [{ isHero: "desc" }, { variant: "asc" }] } },
  });
  if (!project) notFound();

  return (
    <div className="p-6 lg:p-10">
      <Link href="/app/projects" className="inline-flex items-center gap-2 text-white/55 hover:text-accent text-sm">
        <ArrowLeft className="h-4 w-4" /> К проектам
      </Link>

      <header className="mt-4">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/85">{project.type}</div>
        <h1 className="mt-2 font-display text-4xl uppercase text-white">{project.title}</h1>
        <p className="mt-2 text-white/55 text-sm max-w-2xl">{project.prompt}</p>
        {project.style && (
          <div className="mt-3 inline-flex rounded-pill bg-accent/12 border border-accent/30 px-3 py-1 text-xs text-accent">
            Стиль: {project.style}
          </div>
        )}
      </header>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {project.images.map((img) => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10">
            <img src={img.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
            {img.isHero && (
              <div className="absolute top-3 left-3 rounded-pill bg-accent/90 px-3 py-1 text-[10px] font-mono uppercase text-bg-base font-semibold">
                HERO
              </div>
            )}
            <a
              href={img.url}
              download={`jooz-${project.id}-${img.variant}.png`}
              className="absolute bottom-3 right-3 rounded-full h-10 w-10 grid place-items-center bg-accent text-bg-base opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Download className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
