import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { removeVietnameseTones } from "@/lib/utils/helpers";
import { keysToCamel } from "@/lib/utils/format";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("q") || searchParams.get("search") || "";

    let query = supabase
      .from("genre")
      .select("id, name, color, icon, description")
      .order("name", { ascending: true });

    if (search) {
      const cleanSearch = removeVietnameseTones(search);
      query = query.ilike("name", `%${cleanSearch}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[DB_ERROR_GET_GENRES]:", error.message);
      return NextResponse.json(
        { error: "Không thể tải danh sách thể loại lúc này" },
        { status: 500 },
      );
    }

    const formattedData = keysToCamel(data);
    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_GENRES_FATAL_ERROR]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
