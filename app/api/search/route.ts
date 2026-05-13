import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { removeVietnameseTones } from "@/lib/utils/helpers";
import { keysToCamel } from "@/lib/utils/format";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;

    const rawQuery = searchParams.get("q") || "";
    const types = searchParams.get("types")?.split(",") || [
      "track",
      "artist",
      "album",
    ];

    if (!rawQuery.trim()) {
      return NextResponse.json(
        { error: "Thiếu tham số tìm kiếm bắt buộc" },
        { status: 400 },
      );
    }

    const cleanSearch = removeVietnameseTones(rawQuery);
    const searchPattern = `%${cleanSearch}%`;

    const results: any = {
      tracks: [],
      artists: [],
      albums: [],
    };

    const promises = [];

    if (types.includes("track")) {
      promises.push(
        supabase
          .from("track")
          .select(
            `
            id, 
            title, 
            audio_url, 
            image_url, 
            duration, 
            is_explicit, 
            album(id, cover_image),
            track_artists(
              is_main, 
              artist(id, stage_name, profile_image)
            )
          `,
          )
          .ilike("title_search", searchPattern)
          .eq("is_published", true)
          .limit(10)
          .then(({ data, error }) => {
            if (error) console.error("[SEARCH_TRACKS_ERROR]:", error);
            if (!error && data) {
              const mappedTracks = data.map((track: any) => {
                const finalImage =
                  track.image_url || track.album?.cover_image || null;

                let artistsList = [];
                if (track.track_artists && track.track_artists.length > 0) {
                  artistsList = track.track_artists
                    .filter((ta: any) => ta.artist)
                    .map((ta: any) => ({
                      ...ta.artist,
                      is_main: ta.is_main,
                    }));

                  artistsList.sort((a: any, b: any) =>
                    a.is_main === b.is_main ? 0 : a.is_main ? -1 : 1,
                  );
                }

                return {
                  id: track.id,
                  title: track.title,
                  audio_url: track.audio_url,
                  image_url: finalImage,
                  duration: track.duration,
                  is_explicit: track.is_explicit,
                  artists: artistsList,
                  album: track.album ? { id: track.album.id } : null,
                };
              });

              results.tracks = keysToCamel(mappedTracks);
            }
          }),
      );
    }

    if (types.includes("artist")) {
      promises.push(
        supabase
          .from("artist")
          .select("id, stage_name, profile_image, is_verified")
          .ilike("stage_name_search", searchPattern)
          .limit(10)
          .then(({ data, error }) => {
            if (error) console.error("[SEARCH_ARTISTS_ERROR]:", error);
            if (!error && data) results.artists = keysToCamel(data);
          }),
      );
    }

    if (types.includes("album")) {
      promises.push(
        supabase
          .from("album")
          .select(
            "id, title, cover_image, album_type, is_explicit, artist(id, stage_name)",
          )
          .ilike("title_search", searchPattern)
          .eq("is_published", true)
          .limit(10)
          .then(({ data, error }) => {
            if (error) console.error("[SEARCH_ALBUMS_ERROR]:", error);
            if (!error && data) results.albums = keysToCamel(data);
          }),
      );
    }

    await Promise.all(promises);

    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_SEARCH_FATAL_ERROR]:", error);
    return NextResponse.json(
      {
        error:
          "Hệ thống đang bận, không thể tìm kiếm lúc này. Vui lòng thử lại sau.",
      },
      { status: 500 },
    );
  }
}
