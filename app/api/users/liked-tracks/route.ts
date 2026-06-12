import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UserRole } from "@/types";
import { authorizeApi } from "@/lib/session";
import { keysToCamel } from "@/lib/utils/format";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const auth = await authorizeApi();
    if (auth.error || !auth.user?.id) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để xem bài hát yêu thích" },
        { status: 401 },
      );
    }

    const userId = auth.user?.id;
    const role = auth.role;
    const currentArtistId = auth.artistId;

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query = supabase
      .from("liked_tracks")
      .select(
        `
        created_at,
        track!inner(
          *,
          genre(id, name),
          album!inner(
            id, 
            title, 
            cover_image, 
            is_published, 
            artist_id,
            genre(id, name)
          ),
          track_artists(
            is_main,
            artist(id, stage_name, profile_image)
          )
        )
      `,
        { count: "exact" },
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error("[GET_LIKED_TRACKS_DB_ERROR]", error);
      return NextResponse.json(
        { error: "Không thể lấy danh sách bài hát yêu thích" },
        { status: 500 },
      );
    }

    const formattedTracks = data.reduce((acc: any[], item: any) => {
      const trackData = item.track;
      const albumInfo = trackData.album;

      const isTrackPrivate = !trackData.is_published;
      const isAlbumPrivate = !albumInfo.is_published;

      if (isTrackPrivate || isAlbumPrivate) {
        const isOwner =
          role === UserRole.ARTIST && albumInfo.artist_id === currentArtistId;
        const isAdmin = role === UserRole.ADMIN;

        if (!isOwner && !isAdmin) {
          return acc;
        }
      }

      const finalGenre = trackData.genre || albumInfo.genre;

      let artists = [];
      if (trackData.track_artists && trackData.track_artists.length > 0) {
        artists = trackData.track_artists
          .filter((ta: any) => ta.artist)
          .map((ta: any) => ({
            ...ta.artist,
            is_main: ta.is_main,
          }));

        artists.sort((a: any, b: any) =>
          a.is_main === b.is_main ? 0 : a.is_main ? -1 : 1,
        );
      }

      const result = {
        ...trackData,
        artists,
        image_url: trackData.image_url || albumInfo.cover_image,
        genre_id: finalGenre?.id || null,
        genre_name: finalGenre?.name || null,
      };

      delete result.genre;
      delete result.track_artists;

      acc.push(keysToCamel(result));
      return acc;
    }, []);

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;

    return NextResponse.json(
      {
        data: formattedTracks,
        meta: {
          totalItems,
          page,
          limit,
          totalPages,
          hasNextPage,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[GET_LIKED_TRACKS_FATAL_ERROR]", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
