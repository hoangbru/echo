import { authorizeApi } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { keysToCamel } from "@/lib/utils/format";
import { UserRole } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = createClient();

    const auth = await authorizeApi();
    const role = auth.error ? "GUEST" : auth.role;
    const currentUserId = auth.user?.id;

    const { data, error } = await supabase
      .from("artist_request")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[GET_ARTIST_REQUEST_DB_ERROR]", error);
      return NextResponse.json(
        { error: "Không tìm thấy đơn yêu cầu" },
        { status: 404 },
      );
    }

    const isOwner = data.user_id === currentUserId;
    const isAdmin = role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Bạn không có quyền xem đơn yêu cầu này" },
        { status: 403 },
      );
    }

    const formattedData = keysToCamel(data);

    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_ARTIST_REQUEST_FATAL_ERROR]", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
