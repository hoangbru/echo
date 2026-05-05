import { NextRequest, NextResponse } from "next/server";

// Mock search data
const MOCK_TRACKS = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "Synthwave Artists",
    type: "track",
  },
  { id: "2", title: "Electric Pulse", artist: "Future Beats", type: "track" },
];

const MOCK_ARTISTS = [
  { id: "a1", name: "Synthwave Artists", type: "artist" },
  { id: "a2", name: "Future Beats", type: "artist" },
];

const MOCK_ALBUMS = [
  { id: "al1", title: "Digital Nights", type: "album" },
  { id: "al2", title: "Neon Highway", type: "album" },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q")?.toLowerCase() || "";
    const types = searchParams.get("types")?.split(",") || [
      "track",
      "artist",
      "album",
    ];

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter required" },
        { status: 400 },
      );
    }

    const results: any = {};

    // Search tracks
    if (types.includes("track")) {
      results.tracks = MOCK_TRACKS.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.artist.toLowerCase().includes(query),
      ).slice(0, 10);
    }

    // Search artists
    if (types.includes("artist")) {
      results.artists = MOCK_ARTISTS.filter((a) =>
        a.name.toLowerCase().includes(query),
      ).slice(0, 10);
    }

    // Search albums
    if (types.includes("album")) {
      results.albums = MOCK_ALBUMS.filter((a) =>
        a.title.toLowerCase().includes(query),
      ).slice(0, 10);
    }

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
