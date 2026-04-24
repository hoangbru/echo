import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Album } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = createClient();

    const { data, error } = await supabase
      .from("album")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error("Không tìm thấy Album");

    const formattedData: Album = {
      id: data.id,
      title: data.title,
      titleSearch: data.title_search,
      releaseDate: data.release_date,
      coverImage: data.cover_image,
      slug: data.slug,
      albumType: data.album_type,
      artistId: data.artist_id,
      description: data.description,
      genreId: data.genre_id,
      isExplicit: data.is_explicit,
      isPublished: data.is_published,
      recordLabel: data.record_label,
      upc: data.upc,
      language: data.language,
      copyright: data.copyright,
      rating: data.rating,
      totalStreams: data.total_streams,
      totalTracks: data.total_tracks,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
