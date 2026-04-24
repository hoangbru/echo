import PrevButton from "@/components/prev-button";
import { PageHeading } from "@/components/page-heading";
import FormAlbumEdit from "./form-album-edit";

export default async function EditAlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <PrevButton />
      <PageHeading>Chỉnh sửa Album</PageHeading>
      <FormAlbumEdit albumId={id} />
    </div>
  );
}
