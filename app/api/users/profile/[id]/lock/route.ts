import { authorizeApi } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { UserRole } from "@/types";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const supabase = createClient();

  try {
    const { id: targetUserId } = await params;

    const auth = await authorizeApi();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const currentUserId = auth.user?.id;
    const currentUserRole = auth.role;

    const isSelfLock = currentUserId === targetUserId;
    const isAdmin = currentUserRole === UserRole.ADMIN;

    if (!isSelfLock && !isAdmin) {
      return NextResponse.json(
        {
          error:
            "Bạn không có quyền thực hiện hành động này trên tài khoản này",
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { isLocked } = body;

    if (typeof isLocked !== "boolean") {
      return NextResponse.json(
        {
          error:
            "Trạng thái trạng thái tài khoản 'isLocked' truyền vào không hợp lệ",
        },
        { status: 400 },
      );
    }

    if (isSelfLock && !isLocked && !isAdmin) {
      return NextResponse.json(
        {
          error:
            "Thao tác không hợp lệ. Chỉ Quản trị viên mới có quyền mở khóa tài khoản này",
        },
        { status: 403 },
      );
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from("user")
      .update({
        is_locked: isLocked,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetUserId)
      .select("id, username, is_locked")
      .maybeSingle();

    if (updateError || !updatedUser) {
      console.error("[LOCK_USER_DB_ERROR]", updateError);
      return NextResponse.json(
        {
          error:
            "Cập nhật trạng thái tài khoản thất bại hoặc tài khoản không tồn tại",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: updatedUser.is_locked
          ? "Tài khoản đã được vô hiệu hóa/khóa thành công"
          : "Tài khoản đã được kích hoạt/mở khóa thành công",
        data: {
          userId: updatedUser.id,
          username: updatedUser.username,
          isLocked: updatedUser.is_locked,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[LOCK_USER_FATAL_ERROR]", error);
    return NextResponse.json(
      {
        error:
          "Đã xảy ra lỗi hệ thống trong quá trình cập nhật trạng thái tài khoản",
      },
      { status: 500 },
    );
  }
}
