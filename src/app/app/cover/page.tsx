import { requireUser } from "@/lib/require-user";
import { Studio } from "@/components/studio/studio";

export const dynamic = "force-dynamic";

export default async function CoverPage({
  searchParams,
}: {
  searchParams?: { prompt?: string; style?: string };
}) {
  const { user } = await requireUser({ select: { credits: true } });
  return (
    <Studio
      mode="cover"
      initialCredits={user.credits ?? 0}
      initialPrompt={searchParams?.prompt?.slice(0, 2000)}
      initialStyle={searchParams?.style?.slice(0, 80)}
    />
  );
}
