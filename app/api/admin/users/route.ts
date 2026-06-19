import { NextRequest, NextResponse } from "next/server";
import { authorizeApi } from "@/lib/session";
import { createServiceClient } from "@/lib/supabase/service";
import { UserRole } from "@/types";
import { keysToCamel } from "@/lib/utils/format";

export async function GET(request: NextRequest) {
  try {
    const auth = await authorizeApi([UserRole.ADMIN]);
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    const supabaseAdmin = createServiceClient();
    const { searchParams } = request.nextUrl;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const searchQuery = searchParams.get("q") || "";
    const from = (page - 1) * limit;

    let query = supabaseAdmin
      .from("user")
      .select("id, email, username, role, is_locked, created_at, is_premium", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .neq("id", auth.user?.id);

    if (searchQuery) {
      if (searchQuery.length > 20) {
        query = query.eq("id", searchQuery);
      } else {
        query = query.or(
          `email.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`,
        );
      }
    }

    const { data, count, error } = await query.range(from, from + limit - 1);

    if (error) throw error;

    const formattedData = keysToCamel(data);

    return NextResponse.json({ data: formattedData, count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi lấy danh sách user" },
      { status: 500 },
    );
  }
}
