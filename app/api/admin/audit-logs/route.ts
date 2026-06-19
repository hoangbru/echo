import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { authorizeApi } from "@/lib/session";
import { keysToCamel } from "@/lib/utils/format";
import { UserRole } from "@/types";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: NextRequest) {
  try {
    const auth = await authorizeApi([UserRole.ADMIN]);

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const searchParams = request.nextUrl.searchParams;
    const actionFilter = searchParams.get("action");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 50;

    const supabase = createServiceClient();

    let query = supabase
      .from("admin_audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (actionFilter && actionFilter !== "ALL") {
      query = query.eq("action", actionFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[SUPABASE_AUDIT_LOG_ERROR]", error);
      throw new Error("Lỗi truy xuất CSDL");
    }

    const formattedLogs = keysToCamel(data);

    return NextResponse.json({ data: formattedLogs }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_AUDIT_LOGS_ERROR]", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tải nhật ký hệ thống" },
      { status: 500 },
    );
  }
}
