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

    if (error) {
      console.error("[GET_TRACKS_DB_ERROR]:", error);
      return NextResponse.json(
        { error: "Không thể tải danh sách bài hát của album này" },
        { status: 500 },
      );
    }

    let finalTracks = data || [];

    if (finalTracks.length > 0) {
      const albumInfo = finalTracks[0].album;
      const isOwner =
        role === UserRole.ARTIST && albumInfo.artist_id === currentArtistId;
      const isAdmin = role === UserRole.ADMIN;

      if (!albumInfo.is_published && !isOwner && !isAdmin) {
        return NextResponse.json(
          { error: "Album này đang ở chế độ riêng tư" },
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

      let artists = [];
      if (t.track_artists && t.track_artists.length > 0) {
        artists = t.track_artists.map((ta: any) => ({
          ...ta.artist,
          is_main: ta.is_main,
        }));

        artists.sort((a: any, b: any) =>
          a.is_main === b.is_main ? 0 : a.is_main ? -1 : 1,
        );
      }

      delete t.album;
      delete t.genre;
      delete t.track_artists;

      return {
        ...t,
        artists,
        image_url: t.image_url || albumInfo.cover_image,
        genre_id: finalGenre?.id || null,
        genre_name: finalGenre?.name || null,
      };
    });

    const formattedTracks = keysToCamel(cleanData);

    return NextResponse.json({ data: formattedTracks }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_TRACKS_FATAL_ERROR]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống khi tải dữ liệu bài hát" },
      { status: 500 },
    );
  }
}
