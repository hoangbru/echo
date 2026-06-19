import { NextRequest, NextResponse } from "next/server";
import { authorizeApi } from "@/lib/session";
import { createServiceClient } from "@/lib/supabase/service";
import { UserRole } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: targetArtistId } = await params;

    const auth = await authorizeApi([UserRole.ADMIN]);
    if (auth.error || !auth.user?.id) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { isVerified } = body;

    if (typeof isVerified !== "boolean") {
      return NextResponse.json(
        { error: "Trạng thái tham số không hợp lệ" },
        { status: 400 },
      );
    }

    const supabaseAdmin = createServiceClient();

    const { data: updatedArtist, error: updateError } = await supabaseAdmin
      .from("artist")
      .update({
        is_verified: isVerified,
        verified_at: isVerified ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetArtistId)
      .select("id, stage_name, is_verified")
      .single();

    if (updateError || !updatedArtist) {
      console.error("[ADMIN_VERIFY_ARTIST_ERROR]", updateError);
      return NextResponse.json({ error: "Cập nhật thất bại" }, { status: 500 });
    }

    await supabaseAdmin.from("admin_audit_log").insert({
      admin_id: auth.user.id,
      action: isVerified ? "VERIFY_ARTIST" : "UNVERIFY_ARTIST",
      target_id: updatedArtist.id,
      target_name: updatedArtist.stage_name,
      target_type: "ARTIST",
      changes: isVerified
        ? `Đã cấp tích xanh cho nghệ sĩ [${updatedArtist.stage_name}]`
        : `Đã tước tích xanh của nghệ sĩ [${updatedArtist.stage_name}]`,
    });

    return NextResponse.json(
      {
        message: isVerified ? "Đã xác minh nghệ sĩ" : "Đã hủy xác minh",
        data: updatedArtist,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[ADMIN_VERIFY_ARTIST_FATAL]", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
