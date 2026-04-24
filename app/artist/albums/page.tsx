import Link from "next/link";
import { Plus } from "lucide-react";

import AlbumGrid from "./_components/album-grid";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";

import { SearchParams } from "@/types";

export default async function ArtistAlbumsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;

  const page =
    typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page) : 1;
  const search =
    typeof resolvedParams.search === "string" ? resolvedParams.search : "";
  const status =
    typeof resolvedParams.status === "string" ? resolvedParams.status : "all";
  const genre =
    typeof resolvedParams.genre === "string" ? resolvedParams.genre : "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeading>Album của tôi</PageHeading>
          <p className="text-gray-400 mt-1">
            Quản lý album và trạng thái phát hành.
          </p>
        </div>
        <Link href="/artist/albums/new">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
            <Plus className="w-4 h-4 mr-2" /> Tạo album mới
          </Button>
        </Link>
      </div>
      <AlbumGrid search={search} status={status} genre={genre} page={page} />
    </div>
  );
}
