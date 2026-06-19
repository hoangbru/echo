import { NextRequest, NextResponse } from "next/server";
import { authorizeApi } from "@/lib/session";
import { createServiceClient } from "@/lib/supabase/service";
import { UserRole } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: targetUserId } = await params;

    const auth = await authorizeApi([UserRole.ADMIN]);
    if (auth.error || !auth.user?.id) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { isLocked } = body;

    if (typeof isLocked !== "boolean") {
      return NextResponse.json(
        { error: "Trạng thái tham số 'isLocked' không hợp lệ" },
        { status: 400 },
      );
    }

    const supabaseAdmin = createServiceClient();

    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("user")
      .update({
        is_locked: isLocked,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetUserId)
      .select("id, username, is_locked")
      .single();

    if (updateError || !updatedUser) {
      console.error("[ADMIN_LOCK_USER_DB_ERROR]", updateError);
      return NextResponse.json(
        { error: "Không tìm thấy tài khoản hoặc lỗi cập nhật CSDL" },
        { status: 500 },
      );
    }

    const actionType = isLocked ? "BAN_USER" : "UNBAN_USER";
    const actionDesc = isLocked
      ? `Khóa tài khoản [${updatedUser.username}]`
      : `Mở khóa tài khoản [${updatedUser.username}]`;

    const { error: logError } = await supabaseAdmin
      .from("admin_audit_log")
      .insert({
        admin_id: auth.user.id,
        action: actionType,
        target_id: updatedUser.id,
        target_name: updatedUser.username,
        target_type: "USER",
        changes: actionDesc,
      });

    if (logError) {
      console.error("[ADMIN_INSERT_AUDIT_LOG_ERROR]", logError);
    }

    return NextResponse.json(
      {
        message: updatedUser.is_locked
          ? "Tài khoản đã bị khóa thành công"
          : "Tài khoản đã được mở khóa",
        data: updatedUser,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[ADMIN_LOCK_USER_FATAL]", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống cục bộ" },
      { status: 500 },
    );
  }
}
