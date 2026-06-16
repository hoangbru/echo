import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeApi } from "@/lib/session";
import { UserRole } from "@/types";
import { resolvePlaylistOwnership } from "@/lib/utils/helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = createClient();
    const { id: trackId } = await params;

    const auth = await authorizeApi([
      UserRole.USER,
      UserRole.ARTIST,
      UserRole.ADMIN,
    ]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data, error } = await supabase
      .from("playlist_track")
      .select("playlist_id, playlist!inner(user_id)")
      .eq("track_id", trackId)
      .eq("playlist.user_id", auth.user?.id);

    if (error) throw error;

    const addedPlaylistIds = data?.map((item: any) => item.playlist_id) || [];

    return NextResponse.json({ data: addedPlaylistIds }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_TRACK_PLAYLISTS_ERROR]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: playlistId } = await params;
    const supabase = createClient();

    const auth = await authorizeApi([
      UserRole.USER,
      UserRole.ARTIST,
      UserRole.ADMIN,
    ]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const ownershipError = await resolvePlaylistOwnership(
      supabase,
      playlistId,
      auth,
    );
    if (ownershipError) {
      return NextResponse.json(
        { error: ownershipError.error },
        { status: ownershipError.status },
      );
    }

    const body = await request.json().catch(() => null);
    const trackId = body?.trackId as string | undefined;

    if (!trackId) {
      return NextResponse.json(
        { error: "Thiếu thông tin bài hát cần thêm" },
        { status: 400 },
      );
    }

    // Check track exists and is published (non-owners cannot add private tracks)
    const { data: track, error: trackErr } = await supabase
      .from("track")
      .select("id, is_published")
      .eq("id", trackId)
      .single();

    if (trackErr || !track) {
      return NextResponse.json(
        { error: "Bài hát không tồn tại" },
        { status: 404 },
      );
    }

    // Prevent duplicate entries
    const { data: existing } = await supabase
      .from("playlist_track")
      .select("track_id")
      .eq("playlist_id", playlistId)
      .eq("track_id", trackId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Bài hát đã có trong playlist này" },
        { status: 409 },
      );
    }

    // Determine next position
    const { data: lastRow } = await supabase
      .from("playlist_track")
      .select("position")
      .eq("playlist_id", playlistId)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextPosition = (lastRow?.position ?? 0) + 1;

    const { error: insertErr } = await supabase.from("playlist_track").insert({
      playlist_id: playlistId,
      track_id: trackId,
      position: nextPosition,
    });

    if (insertErr) {
      console.error("[POST_PLAYLIST_TRACK_DB_ERROR]:", insertErr);
      return NextResponse.json(
        { error: "Không thể thêm bài hát vào playlist" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Thêm bài hát vào playlist thành công" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[POST_PLAYLIST_TRACK_FATAL_ERROR]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: playlistId } = await params;
    const supabase = createClient();

    const auth = await authorizeApi([
      UserRole.USER,
      UserRole.ARTIST,
      UserRole.ADMIN,
    ]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const ownershipError = await resolvePlaylistOwnership(
      supabase,
      playlistId,
      auth,
    );
    if (ownershipError) {
      return NextResponse.json(
        { error: ownershipError.error },
        { status: ownershipError.status },
      );
    }

    const body = await request.json().catch(() => null);
    const trackId = body?.trackId as string | undefined;

    if (!trackId) {
      return NextResponse.json(
        { error: "Thiếu thông tin bài hát cần xóa" },
        { status: 400 },
      );
    }

    const { error: deleteErr } = await supabase
      .from("playlist_track")
      .delete()
      .eq("playlist_id", playlistId)
      .eq("track_id", trackId);

    if (deleteErr) {
      console.error("[DELETE_PLAYLIST_TRACK_DB_ERROR]:", deleteErr);
      return NextResponse.json(
        { error: "Không thể xóa bài hát khỏi playlist" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Đã xóa bài hát khỏi playlist" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[DELETE_PLAYLIST_TRACK_FATAL_ERROR]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}

// Batch-reorders tracks by updating positions.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: playlistId } = await params;
    const supabase = createClient();

    const auth = await authorizeApi([
      UserRole.USER,
      UserRole.ARTIST,
      UserRole.ADMIN,
    ]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const ownershipError = await resolvePlaylistOwnership(
      supabase,
      playlistId,
      auth,
    );
    if (ownershipError) {
      return NextResponse.json(
        { error: ownershipError.error },
        { status: ownershipError.status },
      );
    }

    const body = await request.json().catch(() => null);
    const tracks: Array<{ trackId: string; position: number }> =
      body?.tracks ?? [];

    if (!Array.isArray(tracks) || tracks.length === 0) {
      return NextResponse.json(
        { error: "Danh sách vị trí bài hát không hợp lệ" },
        { status: 400 },
      );
    }

    // Upsert all position updates in parallel
    const updates = tracks.map(({ trackId, position }) =>
      supabase
        .from("playlist_track")
        .update({ position })
        .eq("playlist_id", playlistId)
        .eq("track_id", trackId),
    );

    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);

    if (failed?.error) {
      console.error("[PATCH_PLAYLIST_TRACK_REORDER_ERROR]:", failed.error);
      return NextResponse.json(
        { error: "Không thể cập nhật thứ tự bài hát" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Cập nhật thứ tự playlist thành công" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[PATCH_PLAYLIST_TRACK_FATAL_ERROR]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
