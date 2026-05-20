import { authorizeApi } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { keysToCamel } from "@/lib/utils/format";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const auth = await authorizeApi();

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", auth.user?.id)
      .maybeSingle();

    if (error) {
      if (error) console.error("[GET_USER_DB_ERROR]", error);
      return NextResponse.json(
        { error: "Không tìm thấy dữ liệu hồ sơ người dùng" },
        { status: 404 },
      );
    }

    const formattedData = keysToCamel(data);

    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_USER_FATAL_ERROR]", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
