import FormAlbumAdd from "./form-album-add";
import PrevButton from "@/components/prev-button";
import { PageHeading } from "@/components/page-heading";

export default async function NewAlbumPage() {
  return (
    <div className="space-y-4">
      <PrevButton />
      <PageHeading>Phát hành album</PageHeading>
      <FormAlbumAdd />
    </div>
  );
}
