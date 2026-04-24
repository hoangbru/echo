import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import TrackTable from "./_components/track-table";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/page-heading";

import { createClient } from "@/lib/supabase/server";
import { ArtistService, ArtistStudioService } from "@/lib/services";
import { ITEMS_PER_PAGE } from "@/constants/pagination";
import { SearchParams } from "@/types";

export default async function ArtistTracksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: currentArtist } = await ArtistService.getCurrentArtistProfile(
    supabase,
    user.id,
  );

  const resolvedParams = await searchParams;

  const page =
    typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page) : 1;
  const search =
    typeof resolvedParams.search === "string" ? resolvedParams.search : "";
  const status =
    typeof resolvedParams.status === "string" ? resolvedParams.status : "all";

  let tracks = [];
  let totalCount = 0;

  if (currentArtist) {
    const result = await ArtistStudioService.getMyTracks(
      supabase,
      currentArtist.id,
      {
        search,
        limit: ITEMS_PER_PAGE,
        status,
        page,
      },
    );
    tracks = result.data || [];
    totalCount = result.totalCount || 0;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeading>Bài hát của tôi</PageHeading>
          <p className="text-gray-400 mt-1">
            Quản lý kho nhạc và trạng thái phát hành.
          </p>
        </div>
        <Link href="/artist/tracks/new">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
            <Plus className="w-4 h-4 mr-2" /> Tải nhạc mới
          </Button>
        </Link>
      </div>

      <TrackTable
        key={`${page}-${search}-${status}`}
        initialTracks={tracks}
        totalCount={totalCount}
        currentPage={page}
        currentSearch={search}
        currentStatus={status}
      />
    </div>
  );
}
