import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeApi } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: trackId } = await params;
    const supabase = createClient();

    const auth = await authorizeApi();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data, error } = await supabase
      .from("liked_tracks")
      .select("track_id")
      .eq("user_id", auth.user?.id)
      .eq("track_id", trackId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return NextResponse.json({ isLiked: !!data }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_LIKE_ERROR]:", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = createClient();
    const { id: trackId } = await params;

    const auth = await authorizeApi();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { error } = await supabase
      .from("liked_tracks")
      .insert({ user_id: auth.user?.id, track_id: trackId });

    if (error) throw error;

    return NextResponse.json({ message: "Liked" }, { status: 200 });
  } catch (error: any) {
    console.error("[POST_LIKE_ERROR]:", error);
    return NextResponse.json({ error: "Không thể thả tim" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = createClient();
    const { id: trackId } = await params;

    const auth = await authorizeApi();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { error } = await supabase
      .from("liked_tracks")
      .delete()
      .eq("user_id", auth.user?.id)
      .eq("track_id", trackId);

    if (error) throw error;

    return NextResponse.json({ message: "Unliked" }, { status: 200 });
  } catch (error: any) {
    console.error("[DELETE_LIKE_ERROR]:", error);
    return NextResponse.json(
      { error: "Không thể bỏ thả tim" },
      { status: 500 },
    );
  }
}
