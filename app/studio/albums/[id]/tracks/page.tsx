import { TrackGrid } from "@/components/features/studio/track";
import { PrevButton } from "@/components/shared/buttons";

export default async function AlbumTracksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <PrevButton />

      <TrackGrid albumId={id} />
    </div>
  );
}
