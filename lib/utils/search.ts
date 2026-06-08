import { createClient } from "@/lib/supabase/server";

import { keysToCamel, mapTrackRow } from "@/lib/utils/format";
import { embedQuery } from "@/lib/gemini";
import type {
  TrackResult,
  ArtistResult,
  AlbumResult,
} from "@/types/search";
import { TRACK_SELECT } from "@/constants/query";

export async function searchTracks(
  supabase: ReturnType<typeof createClient>,
  pattern: string,
): Promise<TrackResult[]> {
  const { data, error } = await supabase
    .from("track")
    .select(TRACK_SELECT)
    .ilike("title_search", pattern)
    .eq("is_published", true)
    .limit(10);

  if (error) {
    console.error("[SEARCH_TRACKS]", error);
    return [];
  }

  return keysToCamel((data ?? []).map((row) => mapTrackRow(row)));
}

export async function searchArtists(
  supabase: ReturnType<typeof createClient>,
  pattern: string,
): Promise<ArtistResult[]> {
  const { data, error } = await supabase
    .from("artist")
    .select("id, stage_name, profile_image, is_verified")
    .ilike("stage_name_search", pattern)
    .limit(10);

  if (error) {
    console.error("[SEARCH_ARTISTS]", error);
    return [];
  }

  return keysToCamel(data ?? []);
}

export async function searchAlbums(
  supabase: ReturnType<typeof createClient>,
  pattern: string,
): Promise<AlbumResult[]> {
  const { data, error } = await supabase
    .from("album")
    .select(
      "id, title, cover_image, album_type, is_explicit, artist(id, stage_name)",
    )
    .ilike("title_search", pattern)
    .eq("is_published", true)
    .limit(10);

  if (error) {
    console.error("[SEARCH_ALBUMS]", error);
    return [];
  }

  return keysToCamel(data ?? []);
}

export async function searchByLyrics(
  supabase: ReturnType<typeof createClient>,
  query: string,
): Promise<TrackResult[]> {
  // 1. Embed user query
  const embedding = await embedQuery(query);

  // 2. Vector similarity search — returns id + similarity only
  const { data: matches, error: rpcError } = await supabase.rpc(
    "search_tracks_by_lyrics",
    { query_embedding: embedding, match_threshold: 0.5, match_count: 10 },
  );

  if (rpcError || !matches?.length) {
    if (rpcError) console.error("[SEARCH_LYRICS_RPC]", rpcError);
    return [];
  }

  // 3. Fetch full track details for matched IDs
  const { data: rows, error: fetchError } = await supabase
    .from("track")
    .select(TRACK_SELECT)
    .in(
      "id",
      matches.map((m: any) => m.id),
    )
    .eq("is_published", true);

  if (fetchError || !rows?.length) {
    if (fetchError) console.error("[SEARCH_LYRICS_FETCH]", fetchError);
    return [];
  }

  // 4. Attach similarity score and sort
  const scoreMap = new Map<string, number>(
    matches.map((m: any) => [m.id, m.similarity]),
  );

  return keysToCamel(
    rows
      .map((row) => mapTrackRow(row, scoreMap.get(row.id) ?? 0))
      .sort((a: any, b: any) => b.similarity - a.similarity),
  );
}
