import { NextRequest, NextResponse } from "next/server";
import { authorizeApi } from "@/lib/session";
import { createServiceClient } from "@/lib/supabase/service";
import { UserRole } from "@/types";

const calculateGrowth = (current: number, past: number) => {
  if (past === 0) return current > 0 ? "+100%" : "0%";
  const growth = ((current - past) / past) * 100;
  return `${growth > 0 ? "+" : ""}${growth.toFixed(1)}%`;
};

export async function GET(request: NextRequest) {
  try {
    const auth = await authorizeApi([UserRole.ADMIN]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const supabaseAdmin = createServiceClient();

    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const [
      { count: totalUsers },
      { count: pastUsers },
      { count: totalArtists },
      { count: pastArtists },
      { count: totalTracks },
      { count: pastTracks },
      { count: totalAlbums },
      { count: pendingRequests },
      { data: topArtists },
      { data: topTracks },
      { data: genreDistribution },
      { data: streamingData },
    ] = await Promise.all([
      
      supabaseAdmin.from("user").select("*", { count: "exact", head: true }),
      
      supabaseAdmin
        .from("user")
        .select("*", { count: "exact", head: true })
        .lte("created_at", thirtyDaysAgo),

      supabaseAdmin.from("artist").select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("artist")
        .select("*", { count: "exact", head: true })
        .lte("created_at", thirtyDaysAgo),

      supabaseAdmin.from("track").select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("track")
        .select("*", { count: "exact", head: true })
        .lte("created_at", thirtyDaysAgo),

      supabaseAdmin.from("album").select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("artist_request")
        .select("*", { count: "exact", head: true })
        .eq("status", "PENDING"),

      supabaseAdmin
        .from("artist")
        .select("id, stage_name, total_followers")
        .order("total_followers", { ascending: false })
        .limit(5),
      supabaseAdmin
        .from("track")
        .select("id, title, total_streams, artist(stage_name)")
        .order("total_streams", { ascending: false })
        .limit(5),

      supabaseAdmin.rpc("get_genre_distribution"),
      supabaseAdmin.rpc("get_daily_system_stats"),
    ]);

    const analyticsData = {
      overview: {
        totalUsers: totalUsers || 0,
        totalArtists: totalArtists || 0,
        totalTracks: totalTracks || 0,
        totalAlbums: totalAlbums || 0,
        pendingRequests: pendingRequests || 0,
        growth: {
          users: calculateGrowth(totalUsers || 0, pastUsers || 0),
          artists: calculateGrowth(totalArtists || 0, pastArtists || 0),
          tracks: calculateGrowth(totalTracks || 0, pastTracks || 0),
        },
      },
      topArtists:
        topArtists?.map((a, i) => ({
          rank: i + 1,
          name: a.stage_name,
          followers: a.total_followers,
        })) || [],
      topTracks:
        topTracks?.map((t: any, i) => ({
          rank: i + 1,
          title: t.title,
          artist: t.artist?.stage_name || "Nghệ sĩ ẩn danh",
          streams: t.total_streams,
        })) || [],

      streamingData: streamingData || [],
      genreDistribution:
        genreDistribution?.map((g: any) => ({
          name: g.name,
          value: Number(g.value),
        })) || [],
    };

    return NextResponse.json({ data: analyticsData }, { status: 200 });
  } catch (error) {
    console.error("[ANALYTICS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Lỗi truy xuất dữ liệu phân tích" },
      { status: 500 },
    );
  }
}
