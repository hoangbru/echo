import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { keysToCamel } from "@/lib/utils/format";
import { authorizeApi } from "@/lib/session";
import { imageFileSchema } from "@/lib/validations/file.schema";
import { getFilePath, uploadFileToSupabase } from "@/lib/utils/file";
import { UserRole } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;

    const by = searchParams.get("by");

    const supabase = createClient();

    let query = supabase.from("artist").select("*");

    if (by === "userId") {
      query = query.eq("user_id", id);
    } else {
      query = query.eq("id", id);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error("[GET_ARTIST_DB_ERROR]:", error);
      return NextResponse.json(
        { error: "Không tìm thấy hồ sơ nghệ sĩ này" },
        { status: 404 },
      );
    }

    const formattedData = keysToCamel(data);

    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_ARTIST_FATAL_ERROR]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = createClient();
  let newProfilePath: string | null = null;
  let newBannerPath: string | null = null;

  try {
    const { id: targetArtistId } = await params;

    const auth = await authorizeApi();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const currentUserId = auth.user?.id;

    const { data: oldArtist, error: oldArtistError } = await supabase
      .from("artist")
      .select("id, user_id, profile_image, banner_image")
      .eq("id", targetArtistId)
      .single();

    if (oldArtistError || !oldArtist) {
      if (oldArtistError)
        console.error("[PATCH_ARTIST_NOT_FOUND]", oldArtistError);
      return NextResponse.json(
        { error: "Không tìm thấy hồ sơ nghệ sĩ để cập nhật" },
        { status: 404 },
      );
    }

    if (auth.role !== UserRole.ADMIN && oldArtist.user_id !== currentUserId) {
      return NextResponse.json(
        { error: "Bạn không có quyền chỉnh sửa hồ sơ nghệ sĩ này" },
        { status: 403 },
      );
    }

    const formData = await request.formData();

    const stageName = (formData.get("stageName") as string)?.trim() || "";
    const bio = (formData.get("bio") as string)?.trim() || "";
    const contactEmail = (formData.get("contactEmail") as string)?.trim() || "";

    if (!stageName) {
      return NextResponse.json(
        { error: "Nghệ danh không được để trống" },
        { status: 400 },
      );
    }

    const profileFile = formData.get("profileImage") as File | null;
    const bannerFile = formData.get("bannerImage") as File | null;

    let profileUrl = oldArtist.profile_image;
    let bannerUrl = oldArtist.banner_image;

    if (profileFile && profileFile.size > 0) {
      const fileValidation = imageFileSchema.safeParse(profileFile);
      if (!fileValidation.success) {
        return NextResponse.json(
          { error: `Ảnh đại diện: ${fileValidation.error.errors[0].message}` },
          { status: 400 },
        );
      }

      const {
        url,
        path,
        error: imgErr,
      } = await uploadFileToSupabase(
        supabase,
        fileValidation.data,
        "covers",
        `artist_profile/${targetArtistId}`,
      );

      if (imgErr) throw new Error("Upload profile image failed");

      profileUrl = url;
      newProfilePath = path;

      if (oldArtist.profile_image) {
        const oldPath = getFilePath(oldArtist.profile_image, "covers");
        if (oldPath) await supabase.storage.from("covers").remove([oldPath]);
      }
    }

    if (bannerFile && bannerFile.size > 0) {
      const fileValidation = imageFileSchema.safeParse(bannerFile);
      if (!fileValidation.success) {
        return NextResponse.json(
          { error: `Ảnh bìa: ${fileValidation.error.errors[0].message}` },
          { status: 400 },
        );
      }

      const {
        url,
        path,
        error: imgErr,
      } = await uploadFileToSupabase(
        supabase,
        fileValidation.data,
        "covers",
        `artist_banner/${targetArtistId}`,
      );

      if (imgErr) throw new Error("Upload banner image failed");

      bannerUrl = url;
      newBannerPath = path;

      if (oldArtist.banner_image) {
        const oldPath = getFilePath(oldArtist.banner_image, "covers");
        if (oldPath) await supabase.storage.from("covers").remove([oldPath]);
      }
    }

    const dbData = {
      stage_name: stageName,
      bio: bio || null,
      contact_email: contactEmail || null,
      profile_image: profileUrl,
      banner_image: bannerUrl,
      updated_at: new Date().toISOString(),
    };

    const { error: dbError } = await supabase
      .from("artist")
      .update(dbData)
      .eq("id", targetArtistId);

    if (dbError) {
      if (newProfilePath)
        await supabase.storage.from("covers").remove([newProfilePath]);
      if (newBannerPath)
        await supabase.storage.from("covers").remove([newBannerPath]);

      console.error("[DB_ARTIST_UPDATE_ERROR]", dbError);
      return NextResponse.json(
        { error: "Không thể cập nhật thông tin hồ sơ nghệ sĩ" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Cập nhật hồ sơ nghệ sĩ thành công" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[PATCH_ARTIST_FATAL_ERROR]", error);

    if (newProfilePath)
      await supabase.storage.from("covers").remove([newProfilePath]);
    if (newBannerPath)
      await supabase.storage.from("covers").remove([newBannerPath]);

    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống trong quá trình cập nhật hồ sơ" },
      { status: 500 },
    );
  }
}
