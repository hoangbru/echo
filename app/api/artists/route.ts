import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { keysToCamel } from "@/lib/utils/format";
import { authorizeApi } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const auth = await authorizeApi();

    let query = supabase
      .from("artist")
      .select("id, stage_name, profile_image")
      .order("stage_name", { ascending: true });

    if (!auth.error && auth.user) {
      query = query.neq("user_id", auth.user.id);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    const formattedData = keysToCamel(data);

    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
