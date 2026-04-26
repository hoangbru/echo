import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { keysToCamel } from "@/lib/utils/format";
import { authorizeApi } from "@/lib/session";
import { UserRole } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: albumId } = await params;
    const supabase = createClient();

    const auth = await authorizeApi();
    const role = auth.error ? "GUEST" : auth.role;
    const currentArtistId = auth.artistId;

    const { data, error } = await supabase
      .from("track")
      .select(
        `
        *,
        genre(id, name), 
        album!inner(
          is_published, 
          artist_id, 
          cover_image, 
          genre(id, name)
        ),
        track_artists(
          is_main,
          artist(id, stage_name, profile_image)
        )
      `,
      )
      .eq("album_id", albumId)
      .order("disc_number", { ascending: true })
      .order("track_number", { ascending: true });

    if (error) throw new Error(error.message);

    let finalTracks = data || [];

    if (finalTracks.length > 0) {
      const albumInfo = finalTracks[0].album;
      const isOwner =
        role === UserRole.ARTIST && albumInfo.artist_id === currentArtistId;
      const isAdmin = role === UserRole.ADMIN;

      if (!albumInfo.is_published && !isOwner && !isAdmin) {
        return NextResponse.json(
          { error: "Album này đang ở chế độ riêng tư." },
          { status: 403 },
        );
      }

      if (!isOwner && !isAdmin) {
        finalTracks = finalTracks.filter(
          (track: any) => track.is_published === true,
        );
      }
    }

    const cleanData = finalTracks.map((t: any) => {
      const albumInfo = t.album;

      const finalGenre = t.genre || albumInfo.genre;
      delete t.album;
      delete t.genre;

      return {
        ...t,
        image_url: t.image_url || albumInfo.cover_image,
        genre_id: finalGenre?.id || null,
        genre_name: finalGenre?.name || null,
      };
    });

    const formattedTracks = keysToCamel(cleanData);

    return NextResponse.json({ data: formattedTracks }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
