import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeApi } from "@/lib/session";
import { keysToCamel } from "@/lib/utils/format";
import { removeVietnameseTones } from "@/lib/utils/utils";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const auth = await authorizeApi();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "stage_name";
    const sortOrder = searchParams.get("order") || "asc";
    const isVerified = searchParams.get("isVerified");

    const offset = (page - 1) * limit;
    const to = offset + limit - 1;

    let query = supabase
      .from("artist")
      .select("id, stage_name, profile_image, contact_email, is_verified", {
        count: "exact",
      });

    if (!auth.error && auth.user) {
      query = query.neq("user_id", auth.user.id);
    }

    if (search) {
      const cleanSearchTerm = removeVietnameseTones(search);
      query = query.or(
        `stage_name_search.ilike.%${cleanSearchTerm}%,contact_email.ilike.%${search}%`,
      );
    }

    if (isVerified !== null) {
      query = query.eq("is_verified", isVerified === "true");
    }

    query = query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(offset, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("[DB_ERROR_GET_ARTISTS]:", error.message, error.details);

      return NextResponse.json(
        {
          error:
            "Không thể tải danh sách nghệ sĩ lúc này. Vui lòng thử lại sau!",
        },
        { status: 500 },
      );
    }

    const formattedData = keysToCamel(data);
    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

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
    console.error("API GET Artists Error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống khi tải dữ liệu nghệ sĩ." },
      { status: 500 },
    );
  }
}
