import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/app/sidebar";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/login?callbackUrl=/app");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { name: true, email: true, credits: true, plan: true },
  });

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="flex">
        <AppSidebar user={user ?? { email: session.user.email }} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
