import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = createClient();

    const { trackId, albumId } = await req.json();

    if (!trackId) {
      return NextResponse.json({ error: "Thiếu trackId" }, { status: 400 });
    }

    const { error } = await supabase.rpc("increment_stream", {
      p_track_id: trackId,
      p_album_id: albumId,
    });

    if (error) {
      return NextResponse.json(
        { error: "Đã xảy ra lỗi hệ thống" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Đã tăng lượt stream" },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
