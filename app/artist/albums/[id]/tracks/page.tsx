import PrevButton from "@/components/prev-button";
import TrackGrid from "@/components/artist/track/track-grid";

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
