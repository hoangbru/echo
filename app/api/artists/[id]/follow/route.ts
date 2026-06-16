import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeApi } from "@/lib/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: artistId } = await params;
    const supabase = createClient();

    const auth = await authorizeApi();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const currentUserId = auth.user?.id;

    const { data: artist, error: artistError } = await supabase
      .from("artist")
      .select("user_id")
      .eq("id", artistId)
      .single();

    if (artistError || !artist) {
      return NextResponse.json(
        { error: "Không tìm thấy nghệ sĩ" },
        { status: 404 },
      );
    }

    const artistUserId = artist.user_id;

    if (currentUserId === artistUserId) {
      return NextResponse.json(
        { error: "Không thể tự theo dõi chính mình" },
        { status: 400 },
      );
    }

    const { data: existingFollow } = await supabase
      .from("follow")
      .select("id")
      .eq("follower_id", currentUserId)
      .eq("following_id", artistUserId)
      .single();

    if (existingFollow) {
      await supabase.from("follow").delete().eq("id", existingFollow.id);
      return NextResponse.json({ isFollowing: false }, { status: 200 });
    } else {
      await supabase.from("follow").insert({
        follower_id: currentUserId,
        following_id: artistUserId,
      });
      return NextResponse.json({ isFollowing: true }, { status: 200 });
    }
  } catch (error: any) {
    console.error("[TOGGLE_FOLLOW_ERROR]", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: artistId } = await params;
    const supabase = createClient();

    const auth = await authorizeApi();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const currentUserId = auth.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ isFollowing: false }, { status: 200 });
    }

    const { data: artist, error: artistError } = await supabase
      .from("artist")
      .select("user_id")
      .eq("id", artistId)
      .single();

    if (artistError || !artist) {
      return NextResponse.json({ isFollowing: false }, { status: 404 });
    }

    const artistUserId = artist.user_id;

    const { data: existingFollow } = await supabase
      .from("follow")
      .select("id")
      .eq("follower_id", currentUserId)
      .eq("following_id", artistUserId)
      .single();

    return NextResponse.json(
      { isFollowing: !!existingFollow },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[GET_FOLLOW_STATUS_ERROR]", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống", isFollowing: false },
      { status: 500 },
    );
  }
}
