// types=track,artist,album → standard ilike search
// types=lyrics             → semantic vector search via pgvector

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { removeVietnameseTones } from "@/lib/utils/helpers";
import { keysToCamel, mapTrackRow } from "@/lib/utils/format";
import { embedQuery } from "@/lib/gemini";
import type {
  SearchResults,
  TrackResult,
  ArtistResult,
  AlbumResult,
} from "@/types/search";
import { TRACK_SELECT } from "@/constants/query";
import { searchSchema } from "@/lib/validations/search.schema";

// ── Search handlers ───────────────────────────────────────────────────────────

async function searchTracks(
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

async function searchArtists(
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

async function searchAlbums(
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

async function searchByLyrics(
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

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const parsed = searchSchema.safeParse({
    q: request.nextUrl.searchParams.get("q") ?? "",
    types: request.nextUrl.searchParams.get("types") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 },
    );
  }

  const { q, types: typesParam } = parsed.data;
  const types = typesParam.split(",").map((t) => t.trim());
  const supabase = createClient();
  const pattern = `%${removeVietnameseTones(q)}%`;

  const results: SearchResults = { tracks: [], artists: [], albums: [] };

  try {
    const jobs: Promise<void>[] = [];

    if (types.includes("track")) {
      jobs.push(
        searchTracks(supabase, pattern).then((r) => {
          results.tracks = r;
        }),
      );
    }
    if (types.includes("artist")) {
      jobs.push(
        searchArtists(supabase, pattern).then((r) => {
          results.artists = r;
        }),
      );
    }
    if (types.includes("album")) {
      jobs.push(
        searchAlbums(supabase, pattern).then((r) => {
          results.albums = r;
        }),
      );
    }
    if (types.includes("lyrics")) {
      jobs.push(
        searchByLyrics(supabase, q)
          .then((matches) => {
            // Append lyrics matches, dedup by id against existing track results
            const existing = new Set(results.tracks.map((t) => t.id));
            results.tracks = [
              ...results.tracks,
              ...matches.filter((t) => !existing.has(t.id)),
            ];
          })
          .catch((err) => {
            // Embedding failure should not break the whole request
            console.error("[SEARCH_LYRICS_EMBED]", err);
          }),
      );
    }

    await Promise.all(jobs);

    return NextResponse.json({ data: results }, { status: 200 });
  } catch (err) {
    console.error("[SEARCH_FATAL]", err);
    return NextResponse.json(
      { error: "Search is unavailable, please try again." },
      { status: 500 },
    );
  }
}
