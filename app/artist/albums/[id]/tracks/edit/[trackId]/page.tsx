import PrevButton from "@/components/prev-button";
import FormTrackEdit from "./form-track-edit";

export default async function EditTrackPage({
  params,
}: {
  params: Promise<{ id: string; trackId: string }>;
}) {
  const { id: albumId, trackId } = await params;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-10 px-6">
      <PrevButton />

      <FormTrackEdit albumId={albumId} trackId={trackId} />
    </div>
  );
}
