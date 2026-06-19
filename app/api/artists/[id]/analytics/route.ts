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

    const { data: analyticsData, error: rpcError } = await supabase.rpc(
      "get_artist_deep_analytics",
      { p_artist_id: targetArtistId },
    );

    if (rpcError) {
      console.error("[RPC_ANALYTICS_ERROR]:", rpcError);
      throw new Error("Lỗi khi truy xuất dữ liệu phân tích từ CSDL");
    }

    const formattedData = keysToCamel(analyticsData);

    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_DEEP_ANALYTICS_FATAL]", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống khi tải phân tích" },
      { status: 500 },
    );
  }
}
