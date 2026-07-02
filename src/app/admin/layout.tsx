import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/login?callbackUrl=/admin");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "admin") redirect("/app");

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-bg-base/80 backdrop-blur-xl">
        <div className="container-wide py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="font-mono text-xs uppercase tracking-widest text-accent border border-accent/30 rounded-pill px-3 py-1">
              Admin CMS
            </span>
          </div>
          <Link href="/app" className="text-sm text-white/65 hover:text-accent">В личный кабинет →</Link>
        </div>
      </header>
      {children}
    </div>
  );
}
