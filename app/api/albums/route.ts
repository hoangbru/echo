import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { removeVietnameseTones } from "@/lib/utils/utils";
import { Album, AlbumDB } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const genreId = searchParams.get("genre") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query = supabase
      .from("album")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) {
      const cleanSearch = removeVietnameseTones(search);
      query = query.ilike("title_search", `%${cleanSearch}%`);
    }

    if (status === "public") query = query.eq("is_published", true);
    if (status === "private") query = query.eq("is_published", false);

    if (genreId !== "all") {
      query = query.eq("genre_id", genreId);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) throw new Error("Lỗi truy vấn: " + error.message);

    const formattedData = (data || []).map((album: AlbumDB) => ({
      id: album.id,
      title: album.title,
      titleSearch: album.title_search,
      releaseDate: album.release_date,
      coverImage: album.cover_image,
      slug: album.slug,
      albumType: album.album_type,
      artistId: album.artist_id,
      description: album.description,
      genreId: album.genre_id,
      isExplicit: album.is_explicit,
      isPublished: album.is_published,
      recordLabel: album.record_label,
      upc: album.upc,
      language: album.language,
      copyright: album.copyright,
      rating: album.rating,
      totalStreams: album.total_streams,
      totalTracks: album.total_tracks,
      createdAt: album.created_at,
      updatedAt: album.updated_at,
    }));

    return NextResponse.json(
      {
        data: formattedData,
        meta: {
          totalCount: count || 0,
          page,
          limit,
          totalPages: count ? Math.ceil(count / limit) : 0,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
