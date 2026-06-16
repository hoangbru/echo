import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeApi } from "@/lib/session";
import { keysToCamel } from "@/lib/utils/format";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const auth = await authorizeApi();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const currentUserId = auth.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ isFollowing: false }, { status: 200 });
    }

    const { data: follows, error: followError } = await supabase
      .from("follow")
      .select("following_id")
      .eq("follower_id", currentUserId);

    if (followError) throw followError;

    if (!follows || follows.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const followingIds = follows.map((f) => f.following_id);

    const { data: artists, error: artistError } = await supabase
      .from("artist")
      .select("id, stage_name, profile_image, is_verified, user_id")
      .in("user_id", followingIds);

    if (artistError) throw artistError;

    const formattedData = keysToCamel(artists || []);

    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_FOLLOWING_ARTISTS_ERROR]", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
