import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { keysToCamel } from "@/lib/utils/format";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: artistId } = await params;

    const { searchParams } = new URL(request.url);
    const excludeAlbumId = searchParams.get("exclude");

    const supabase = createClient();

    let query = supabase
      .from("album")
      .select(
        `id, title, cover_image, release_date, album_type, 
        artist(id, stage_name, profile_image)`,
      )
      .eq("artist_id", artistId)
      .eq("is_published", true)
      .order("release_date", { ascending: false })
      .limit(6);

    if (excludeAlbumId) {
      query = query.neq("id", excludeAlbumId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[DB_ERROR_GET_OTHERS_ALBUMS]", error);
      return NextResponse.json(
        { error: "Không thể lấy danh sách album" },
        { status: 500 },
      );
    }
    const formattedData = keysToCamel(data || []);

    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (err) {
    console.error("[DB_ERROR_GET_OTHERS_ALBUMS]", err);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
