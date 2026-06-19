import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { keysToCamel } from "@/lib/utils/format";
import { authorizeApi } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const by = searchParams.get("by") || "id";

    const timeRange = searchParams.get("timeRange") || "30";
    const p_days = parseInt(timeRange, 10);

    const supabase = createClient();
    const auth = await authorizeApi();

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    let targetArtistId = id;
    if (by === "userId") {
      const { data: artistProfile, error: profileErr } = await supabase
        .from("artist")
        .select("id")
        .eq("user_id", id)
        .single();

      if (profileErr || !artistProfile) {
        return NextResponse.json(
          { error: "Không tìm thấy hồ sơ nghệ sĩ" },
          { status: 404 },
        );
      }
      targetArtistId = artistProfile.id;
    }

    const [artistRes, tracksRes, chartRes] = await Promise.all([
      supabase
        .from("artist")
        .select("total_streams, total_followers, total_tracks, total_albums")
        .eq("id", targetArtistId)
        .single(),

      // Top 4 bài hát phổ biến nhất
      supabase
        .from("track")
        .select("id, title, total_streams, image_url, album(cover_image)")
        .eq("artist_id", targetArtistId)
        .eq("is_published", true)
        .order("total_streams", { ascending: false })
        .limit(4),

      // Dữ liệu biểu đồ & Tỷ lệ từ RPC
      supabase.rpc("get_artist_chart_and_listeners", {
        p_artist_id: targetArtistId,
        p_days: p_days
      }),
    ]);

    if (artistRes.error) throw artistRes.error;

    const formattedTopTracks = (tracksRes.data || []).map((t: any) => {
      const albumCover =
        t.album && !Array.isArray(t.album) ? t.album.cover_image : null;

      return {
        id: t.id,
        title: t.title,
        totalStreams: t.total_streams,
        imageUrl: t.image_url || albumCover || null,
      };
    });

    const responsePayload = keysToCamel({
      overview: {
        totalStreams: artistRes.data.total_streams || 0,
        totalFollowers: artistRes.data.total_followers || 0,
        totalTracks: artistRes.data.total_tracks || 0,
        totalAlbums: artistRes.data.total_albums || 0,
        monthlyListeners: chartRes.data?.monthlyListeners || 0,
        completionRate: chartRes.data?.completionRate || 0,
      },
      chartData: chartRes.data?.chartData || [],
      topTracks: formattedTopTracks,
    });

    return NextResponse.json({ data: responsePayload }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_DASHBOARD_STATS_ERROR]", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tải dữ liệu phân tích" },
      { status: 500 },
    );
  }
}
