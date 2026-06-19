import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeApi } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const body = await req.json();
    const { trackId, albumId, duration, progress } = body;

    if (!trackId) {
      return NextResponse.json(
        { error: "Thiếu dữ liệu trackId bắt buộc" },
        { status: 400 },
      );
    }

    const auth = await authorizeApi();
    const userId = auth.user?.id || null;

    const { error } = await supabase.from("stream_logs").insert({
      user_id: userId,
      track_id: trackId,
      album_id: albumId,
      duration: duration,
      progress: Math.floor(progress),
      is_processed: false,
    });

    if (error) {
      console.error("[INSERT_STREAM_LOG_ERROR]:", error);
      return NextResponse.json(
        { error: "Không thể ghi nhận lượt nghe lúc này" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Lượt nghe đã được đưa vào hàng đợi" },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("[POST_STREAM_FATAL_ERROR]:", err);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
