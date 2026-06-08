import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeApi } from "@/lib/session";
import { keysToCamel } from "@/lib/utils/format";
import { UserRole } from "@/types";
import { imageFileSchema } from "@/lib/validations/file.schema";
import { uploadFileToSupabase } from "@/lib/utils/file";
import { playlistFormSchema } from "@/lib/validations/playlist.schema";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const auth = await authorizeApi();
    const role = auth.error ? "GUEST" : auth.role;
    const currentUserId = auth.user.id;

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all"; // "all" | "public" | "private"
    const userId = searchParams.get("userId") || null;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query = supabase
      .from("playlist")
      .select("*, user:user_id(id, username, avatar)", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    if (role === UserRole.ADMIN) {
      // Admin sees all — apply optional status filter only
      if (status === "public") query = query.eq("is_public", true);
      if (status === "private") query = query.eq("is_public", false);
    } else if (role !== "GUEST" && currentUserId) {
      // Authenticated user: public playlists OR their own private ones
      if (status === "public") {
        query = query.eq("is_public", true);
      } else if (status === "private") {
        query = query.eq("is_public", false).eq("user_id", currentUserId);
      } else {
        query = query.or(
          `is_public.eq.true,and(is_public.eq.false,user_id.eq.${currentUserId})`,
        );
      }
    } else {
      // Guest: public only
      query = query.eq("is_public", true);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error("[GET_PLAYLISTS_DB_ERROR]:", error);
      return NextResponse.json(
        { error: "Không thể tải danh sách phát lúc này" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        data: keysToCamel(data || []),
        meta: {
          totalCount: count || 0,
          page,
          limit,
          totalPages: count ? Math.ceil(count / limit) : 0,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[GET_PLAYLISTS_FATAL_ERROR]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  let uploadedCoverPath: string | null = null;
  const supabase = createClient();

  try {
    const auth = await authorizeApi([
      UserRole.USER,
      UserRole.ARTIST,
      UserRole.ADMIN,
    ]);

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const currentUserId = auth.user.id;

    const formData = await request.formData();

    const rawData = {
      title: formData.get("title") as string | null,
      description: formData.get("description") as string | null,
      isPublic: formData.get("isPublic") === "true",
    };

    const coverFile = formData.get("coverFile") as File | null;

    const validatedData = playlistFormSchema.safeParse(rawData);
    if (!validatedData.success) {
      const errorMessage = validatedData.error.errors[0].message;
      console.error("[POST_PLAYLIST_VALIDATION_ERROR]:", validatedData.error.errors[0]);
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    const safeData = validatedData.data;

    let coverImageUrl: string | null = null;

    if (coverFile && coverFile.size > 0) {
      const fileValidation = imageFileSchema.safeParse(coverFile);
      if (!fileValidation.success) {
        return NextResponse.json(
          { error: fileValidation.error.errors[0].message },
          { status: 400 },
        );
      }

      const {
        url: imgUrl,
        path: iPath,
        error: imgErr,
      } = await uploadFileToSupabase(
        supabase,
        fileValidation.data,
        "covers",
        `playlists/${currentUserId}`,
      );

      if (imgErr) {
        console.error("[POST_PLAYLIST_COVER_UPLOAD_ERROR]:", imgErr);
        return NextResponse.json(
          { error: "Tải lên ảnh bìa thất bại" },
          { status: 400 },
        );
      }

      coverImageUrl = imgUrl;
      uploadedCoverPath = iPath;
    }

    const { data: newPlaylist, error: dbError } = await supabase
      .from("playlist")
      .insert({
        user_id: currentUserId,
        title: safeData.title,
        description: safeData.description,
        is_public: safeData.isPublic,
        cover_image: coverImageUrl,
      })
      .select()
      .single();

    if (dbError) {
      console.error("[POST_PLAYLIST_DB_ERROR]:", dbError);
      if (uploadedCoverPath)
        await supabase.storage.from("covers").remove([uploadedCoverPath]);
      return NextResponse.json(
        { error: "Tạo playlist không thành công, vui lòng thử lại" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { data: keysToCamel(newPlaylist), message: "Tạo playlist thành công" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[POST_PLAYLIST_FATAL_ERROR]:", error);
    if (uploadedCoverPath)
      await supabase.storage.from("covers").remove([uploadedCoverPath]);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
