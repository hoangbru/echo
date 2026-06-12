import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeApi } from "@/lib/session";
import { keysToCamel } from "@/lib/utils/format";
import { UserRole } from "@/types";
import { removeVietnameseTones } from "@/lib/utils/helpers";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const auth = await authorizeApi();
    const role = auth.error ? "GUEST" : auth.role;
    const currentUserId = auth.user?.id;

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const userId = searchParams.get("userId") || null;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query = supabase
      .from("playlist")
      .select("*, user:user_id(id, username, avatar)", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) {
      const cleanSearch = removeVietnameseTones(search);
      query = query.ilike("title_search", `%${cleanSearch}%`);
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
  const supabase = createClient();

  try {
    const { user, error, status } = await authorizeApi([
      UserRole.USER,
      UserRole.ARTIST,
      UserRole.ADMIN,
    ]);

    if (error) {
      return NextResponse.json({ error: error }, { status: status });
    }

    const currentUserId = user?.id;

    let title: string | null = null;
    let description: string | null = null;
    let isPublic = true;

    try {
      const body = await request.json();
      title = body?.title || null;
      description = body?.description || null;
      if (body?.isPublic !== undefined) {
        isPublic = body.isPublic;
      }
    } catch (e) {}

    const { count, error: countError } = await supabase
      .from("playlist")
      .select("*", { count: "exact", head: true })
      .eq("user_id", currentUserId);

    if (countError) {
      console.warn(
        "[POST_PLAYLIST_COUNT_WARN]: Không thể đếm playlist, mặc định số 1",
        countError,
      );
    }

    const nextIndex = (count || 0) + 1;
    const defaultTitle = `Danh sách phát của tôi #${nextIndex}`;

    const finalTitle =
      title && title.trim() !== "" ? title.trim() : defaultTitle;

    const { data: newPlaylist, error: dbError } = await supabase
      .from("playlist")
      .insert({
        user_id: currentUserId,
        title: finalTitle,
        description: description || null,
        is_public: isPublic,
        cover_image: null,
      })
      .select()
      .single();

    if (dbError) {
      console.error("[POST_PLAYLIST_DB_ERROR]:", dbError);
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
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
