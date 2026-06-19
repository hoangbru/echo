import { NextResponse } from "next/server";
import { authorizeApi } from "@/lib/session";
import { createServiceClient } from "@/lib/supabase/service";
import { UserRole } from "@/types";

export async function GET() {
  try {
    const auth = await authorizeApi([UserRole.ADMIN]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const supabaseAdmin = createServiceClient();

    const [{ count: pendingRequests }, { count: pendingReports }] =
      await Promise.all([
        supabaseAdmin
          .from("artist_request")
          .select("*", { count: "exact", head: true })
          .eq("status", "PENDING"),

        supabaseAdmin
          .from("content_report")
          .select("*", { count: "exact", head: true })
          .eq("status", "PENDING"),
      ]);

    return NextResponse.json(
      {
        pendingRequests: pendingRequests || 0,
        pendingReports: pendingReports || 0,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET_BADGES_ERROR]", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
