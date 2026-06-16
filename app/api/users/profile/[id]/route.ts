import { authorizeApi } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { getFilePath, uploadFileToSupabase } from "@/lib/utils/file";
import { imageFileSchema } from "@/lib/validations/file.schema";
import { userFormSchema } from "@/lib/validations/user.schema";
import { UserRole } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = createClient();
  let newUploadedPath: string | null = null;

  try {
    const { id: targetUserId } = await params;

    const auth = await authorizeApi();

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const currentUserId = auth.user?.id;

    const { data: oldUser, error: oldUserError } = await supabase
      .from("user")
      .select("id, avatar, username")
      .eq("id", targetUserId)
      .single();

    if (oldUserError || !oldUser) {
      if (oldUserError) console.error("[PATCH_USER_NOT_FOUND]", oldUserError);
      return NextResponse.json(
        { error: "Không tìm thấy hồ sơ người dùng để cập nhật" },
        { status: 404 },
      );
    }

    if (auth.role !== UserRole.ADMIN && oldUser.id !== currentUserId) {
      return NextResponse.json(
        { error: "Bạn không có quyền chỉnh sửa hồ sơ người dùng này" },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const rawData = {
      fullName: (formData.get("fullName") as string) || "",
      username: (formData.get("username") as string) || "",
      bio: (formData.get("bio") as string | null) || "",
    };

    const validatedData = userFormSchema.safeParse(rawData);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors[0].message },
        { status: 400 },
      );
    }

    const safeData = validatedData.data;
    const newAvatarFile = formData.get("avatarFile") as File | null;
    let avatarUrl = oldUser?.avatar;

    if (newAvatarFile && newAvatarFile.size > 0) {
      const fileValidation = imageFileSchema.safeParse(newAvatarFile);
      if (!fileValidation.success) {
        return NextResponse.json(
          { error: fileValidation.error.errors[0].message },
          { status: 400 },
        );
      }
      const validFile = fileValidation.data;

      const {
        url: imgUrl,
        path: iPath,
        error: imgErr,
      } = await uploadFileToSupabase(
        supabase,
        validFile,
        "covers",
        `profile/${targetUserId}`,
      );

      if (imgErr) {
        console.error("[STORAGE_ERROR_UPDATE_USER_AVATAR]:", imgErr);
        return NextResponse.json(
          { error: "Tải lên ảnh đại diện mới thất bại" },
          { status: 400 },
        );
      }

      avatarUrl = imgUrl;
      newUploadedPath = iPath;

      if (oldUser?.avatar) {
        const oldPath = getFilePath(oldUser.avatar, "covers");
        if (oldPath) await supabase.storage.from("covers").remove([oldPath]);
      }
    }

    const dbData: any = {
      full_name: safeData.fullName,
      username: safeData.username.trim().toLowerCase(),
      bio: safeData.bio || null,
      avatar: avatarUrl,
      updated_at: new Date().toISOString(),
    };

    const { error: dbError } = await supabase
      .from("user")
      .update(dbData)
      .eq("id", targetUserId);

    if (dbError) {
      if (dbError.code === "23505") {
        if (newUploadedPath) {
          await supabase.storage.from("covers").remove([newUploadedPath]);
        }
        return NextResponse.json(
          { error: "Tên người dùng (username) này đã được sử dụng" },
          { status: 409 },
        );
      }

      console.error("[DB_USER_UPDATE_ERROR]", dbError);
      if (newUploadedPath) {
        await supabase.storage.from("covers").remove([newUploadedPath]);
      }
      return NextResponse.json(
        { error: "Không thể cập nhật thông tin hồ sơ" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Cập nhật hồ sơ người dùng thành công" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[PATCH_USER_FATAL_ERROR]", error);
    if (newUploadedPath) {
      await supabase.storage.from("covers").remove([newUploadedPath]);
    }
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống trong quá trình cập nhật hồ sơ" },
      { status: 500 },
    );
  }
}
