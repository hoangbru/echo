import { FormTrackAdd } from "@/components/features/artist/track";
import { PrevButton } from "@/components/shared/buttons";

export default async function NewTrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: albumId } = await params;

  return (
    <div className="space-y-4">
      <PrevButton />

      <FormTrackAdd albumId={albumId} />
    </div>
  );
}
