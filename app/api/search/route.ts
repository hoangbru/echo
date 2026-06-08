// types=track,artist,album → standard ilike search
// types=lyrics             → semantic vector search via pgvector

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { removeVietnameseTones } from "@/lib/utils/helpers";
import type { SearchResults } from "@/types/search";
import { searchSchema } from "@/lib/validations/search.schema";
import {
  searchAlbums,
  searchArtists,
  searchByLyrics,
  searchTracks,
} from "@/lib/utils/search";

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
