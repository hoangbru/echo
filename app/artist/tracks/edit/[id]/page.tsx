import { redirect } from "next/navigation";

import FormTrackEdit from "./form-track-edit";
import PrevButton from "@/components/prev-button";
import { PageHeading } from "@/components/page-heading";

import { createClient } from "@/lib/supabase/server";
import { GenreService } from "@/lib/services/genre.service";
import {
  ArtistService,
  ArtistStudioService,
  TrackService,
} from "@/lib/services";
import { AlbumCard } from "@/types";

export default async function EditTrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const resolvedParams = await params;

  const { data: genres } = await GenreService.getGenres(supabase);
  const track = await TrackService.getTrackById(supabase, resolvedParams.id);
  const {data: currentArtist} = await ArtistService.getCurrentArtistProfile(
    supabase,
    user.id,
  );
  
  if (!currentArtist) redirect("/artist/tracks");

  let albums: AlbumCard[] = [];
  if (currentArtist) {
    albums = await ArtistStudioService.getAlbumsMinimal(
      supabase,
      currentArtist?.id,
    );
  }

  return (
    <div className="space-y-4">
      <PrevButton />
      <PageHeading>Chỉnh sửa bài hát: {track?.title || ""}</PageHeading>
      <FormTrackEdit
        track={track}
        genres={genres}
        albums={albums}
        artistId={currentArtist?.id || ""}
      />
    </div>
  );
}
