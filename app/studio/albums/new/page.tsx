import { FormAlbumAdd } from "@/components/features/artist/album";
import { PrevButton } from "@/components/shared/buttons";
import { PageHeading } from "@/components/ui/page-heading";

export default async function NewAlbumPage() {
  return (
    <div className="space-y-4">
      <PrevButton />
      <PageHeading>Phát hành album</PageHeading>
      <FormAlbumAdd />
    </div>
  );
}
