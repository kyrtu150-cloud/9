import { requireUser } from "@/lib/require-user";
import { Studio } from "@/components/studio/studio";

export const dynamic = "force-dynamic";

export default async function CoverPage() {
  const { user } = await requireUser({ select: { credits: true } });
  return <Studio mode="cover" initialCredits={user.credits ?? 0} />;
}
