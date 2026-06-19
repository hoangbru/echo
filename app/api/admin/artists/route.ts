import { NextRequest, NextResponse } from "next/server";
import { authorizeApi } from "@/lib/session";
import { createServiceClient } from "@/lib/supabase/service";
import { UserRole } from "@/types";
import { keysToCamel } from "@/lib/utils/format";
import { removeVietnameseTones } from "@/lib/utils/helpers";

export async function GET(request: NextRequest) {
  try {
    const auth = await authorizeApi([UserRole.ADMIN]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const supabaseAdmin = createServiceClient();
    const { searchParams } = request.nextUrl;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const searchQuery = searchParams.get("q") || "";
    const from = (page - 1) * limit;

    let query = supabaseAdmin
      .from("artist")
      .select(
        "id, stage_name, contact_email, is_verified, verified_at, created_at, user_id, total_followers",
        { count: "exact" },
      )
      .order("created_at", { ascending: false });

    if (searchQuery) {
      if (searchQuery.length > 20) {
        query = query.eq("id", searchQuery);
      } else {
        const cleanSearchTerm = removeVietnameseTones(searchQuery);
        query = query.or(
          `stage_name_search.ilike.%${cleanSearchTerm}%,contact_email.ilike.%${searchQuery}%`,
        );
      }
    }

    const { data, count, error } = await query.range(from, from + limit - 1);

    if (error) throw error;

    const formattedData = keysToCamel(data);

    return NextResponse.json({ data: formattedData, count }, { status: 200 });
  } catch (error) {
    console.error("[GET_ARTISTS_ERROR]", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi tải danh sách nghệ sĩ" },
      { status: 500 },
    );
  }
}
