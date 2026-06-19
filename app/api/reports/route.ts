import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeApi } from "@/lib/session";
import { keysToCamel } from "@/lib/utils/format";
import { createServiceClient } from "@/lib/supabase/service";
import { UserRole } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const auth = await authorizeApi([UserRole.ADMIN]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || "ALL";

    const supabase = createServiceClient();

    let query = supabase
      .from("content_report")
      .select("*")
      .order("created_at", { ascending: false });

    if (status !== "ALL") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    const formattedData = keysToCamel(data);

    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_ADMIN_REPORTS_ERROR]", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const auth = await authorizeApi();

    // 1. Yêu cầu bắt buộc phải đăng nhập mới được báo cáo
    if (auth.error || !auth.user?.id) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để thực hiện chức năng này" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      reportType,
      targetId,
      targetName,
      targetType,
      reason,
      description,
    } = body;

    // 2. Validate dữ liệu đầu vào cơ bản
    if (!reportType || !targetId || !targetType || !reason) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp đầy đủ thông tin bắt buộc" },
        { status: 400 },
      );
    }

    // 3. Ghi vào Database (RLS sẽ tự động đối chiếu reporter_id với auth.uid())
    const { error: insertError } = await supabase
      .from("content_report")
      .insert({
        reporter_id: auth.user.id, // ID của người đang đăng nhập
        report_type: reportType,
        target_id: targetId,
        target_name: targetName || null,
        target_type: targetType, // VD: 'TRACK', 'ALBUM', 'ARTIST'
        reason: reason,
        description: description || null,
        status: "PENDING", // Trạng thái mặc định
      });

    if (insertError) throw insertError;

    return NextResponse.json(
      {
        message:
          "Báo cáo của bạn đã được ghi nhận. Hệ thống sẽ xem xét sớm nhất có thể.",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[POST_CONTENT_REPORT_ERROR]", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi gửi báo cáo" },
      { status: 500 },
    );
  }
}
