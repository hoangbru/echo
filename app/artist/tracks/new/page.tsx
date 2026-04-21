import { redirect } from "next/navigation";

import FormTrackNew from "./form-track-new";
import { PageHeading } from "@/components/page-heading";
import PrevButton from "@/components/prev-button";

import { ArtistService, ArtistStudioService } from "@/lib/services";
import { GenreService } from "@/lib/services/genre.service";
import { createClient } from "@/lib/supabase/server";
import { AlbumCard } from "@/types";

export default async function ArtistUploadPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: genres } = await GenreService.getGenres(supabase);
  const currentArtist = await ArtistService.getCurrentArtistProfile(
    supabase,
    user.id,
  );
  if (!currentArtist) redirect("/artist/setup");

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
      <PageHeading>Phát hành bài hát</PageHeading>
      <FormTrackNew
        genres={genres}
        albums={albums}
        artistId={currentArtist?.id || ""}
      />
    </div>
  );
}
