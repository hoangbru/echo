import PrevButton from "@/components/prev-button";
import FormTrackAdd from "./form-track-add";

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
