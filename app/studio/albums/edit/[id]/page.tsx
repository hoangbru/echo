import { FormAlbumEdit } from "@/components/features/artist/album";
import { PrevButton } from "@/components/shared/buttons";
import { PageHeading } from "@/components/ui/page-heading";

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
