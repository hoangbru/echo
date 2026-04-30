import PrevButton from "@/components/prev-button";
import FormTrackEdit from "./form-track-edit";

export default async function EditTrackPage({
  params,
}: {
  params: Promise<{ id: string; trackId: string }>;
}) {
  const { id: albumId, trackId } = await params;

  return (
    <div className="space-y-4">
      <PrevButton />

      <FormTrackEdit albumId={albumId} trackId={trackId} />
    </div>
  );
}
