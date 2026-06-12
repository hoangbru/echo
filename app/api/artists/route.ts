import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeApi } from "@/lib/session";
import { keysToCamel } from "@/lib/utils/format";
import { removeVietnameseTones } from "@/lib/utils/helpers";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const auth = await authorizeApi();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "stage_name";
    const sortOrder = searchParams.get("order") || "asc";

    const offset = (page - 1) * limit;
    const to = offset + limit - 1;

    let query = supabase
      .from("artist")
      .select("id, stage_name, profile_image, contact_email, is_verified", {
        count: "exact",
      });

    if (!auth.error && auth.user) {
      query = query.neq("user_id", auth.user?.id);
    }

    if (search) {
      const cleanSearchTerm = removeVietnameseTones(search);
      query = query.or(
        `stage_name_search.ilike.%${cleanSearchTerm}%,contact_email.ilike.%${search}%`,
      );
    }

    query = query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(offset, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("[GET_ARTISTS_DB_ERROR]:", error);
      return NextResponse.json(
        { error: "Không thể tải danh sách nghệ sĩ lúc này" },
        { status: 500 },
      );
    }

    const formattedData = keysToCamel(data || []);
    const totalCount = count || 0;
    const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 0;

    return NextResponse.json(
      {
        data: formattedData,
        meta: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[GET_ARTISTS_FATAL_ERROR]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống khi tải dữ liệu nghệ sĩ" },
      { status: 500 },
    );
  }
}
