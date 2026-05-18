import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { generateSlug, removeVietnameseTones } from "@/lib/utils/helpers";
import { albumFormSchema } from "@/lib/validations/album.schema";
import { imageFileSchema } from "@/lib/validations/file.schema";
import { AlbumType, UserRole } from "@/types";
import { authorizeApi } from "@/lib/session";
import { keysToCamel } from "@/lib/utils/format";
import { uploadFileToSupabase } from "@/lib/utils/file";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const auth = await authorizeApi();
    const role = auth.error ? "GUEST" : auth.role;
    const currentArtistId = auth.artistId;

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const genreId = searchParams.get("genre") || "all";
    const view = searchParams.get("view");
    const type = searchParams.get("type") || "all";

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query = supabase
      .from("album")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) {
      const cleanSearch = removeVietnameseTones(search);
      query = query.ilike("title_search", `%${cleanSearch}%`);
    }

    if (genreId !== "all") {
      query = query.eq("genre_id", genreId);
    }

    if (
      type !== "all" &&
      Object.values(AlbumType).includes(type as AlbumType)
    ) {
      query = query.eq("album_type", type);
    }

    if (role === UserRole.ADMIN) {
      if (status === "public") query = query.eq("is_published", true);
      if (status === "private") query = query.eq("is_published", false);
    } else if (role === UserRole.ARTIST && view === "studio") {
      query = query.eq("artist_id", currentArtistId);

      if (status === "public") query = query.eq("is_published", true);
      if (status === "private") query = query.eq("is_published", false);
    } else {
      query = query.eq("is_published", true);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error("[DB_ERROR_GET_ALBUMS]:", error);
      return NextResponse.json(
        {
          error: "Hệ thống đang bận hoặc không thể tải danh sách Album lúc này",
        },
        { status: 500 },
      );
    }

    const formattedData = keysToCamel(data || []);

    return NextResponse.json(
      {
        data: formattedData,
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
    console.error("[DB_ERROR_GET_ALBUMS]", error);
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
    const auth = await authorizeApi([UserRole.ARTIST, UserRole.ADMIN]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const formData = await request.formData();

    let finalArtistId = auth.artistId;
    if (auth.role === UserRole.ADMIN) {
      finalArtistId = formData.get("artistId") as string;
      if (!finalArtistId)
        return NextResponse.json(
          { error: "Admin cần chọn Nghệ sĩ sở hữu Album này" },
          { status: 403 },
        );
    }

    const rawGenreId = formData.get("genreId") as string | null;
    const rawData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string | null) || "",
      releaseDate: (formData.get("releaseDate") as string | null) || "",
      genreId:
        !rawGenreId || rawGenreId.trim() === "" || rawGenreId === "null"
          ? null
          : rawGenreId,
      isPublished: formData.get("isPublished") === "true",
      albumType: (formData.get("albumType") as string) || "ALBUM",
      isExplicit: formData.get("isExplicit") === "true",
      recordLabel: (formData.get("recordLabel") as string | null) || "",
      copyright: (formData.get("copyright") as string | null) || "",
      upc: (formData.get("upc") as string | null) || "",
      language: (formData.get("language") as string | null) || "vi",
    };

    const coverFile = formData.get("coverFile") as File | null;

    const validatedData = albumFormSchema.safeParse(rawData);
    if (!validatedData.success) {
      const errorMessage = validatedData.error.errors[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    const safeData = validatedData.data;

    const fileValidation = imageFileSchema.safeParse(coverFile);
    if (!fileValidation.success) {
      const errorMessage = fileValidation.error.errors[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    let coverImageUrl = null;
    const validFile = fileValidation.data;

    const {
      url: imgUrl,
      path: iPath,
      error: imgErr,
    } = await uploadFileToSupabase(
      supabase,
      validFile,
      "covers",
      `albums/${finalArtistId}`,
    );

    if (imgErr) {
      console.error("[STORAGE_ERROR_UPLOAD_COVER]:", imgErr);
      return NextResponse.json(
        { error: "Tải lên không thành công" },
        { status: 400 },
      );
    }

    coverImageUrl = imgUrl;
    uploadedCoverPath = iPath;

    const dbData: any = {
      title: safeData.title,
      artist_id: finalArtistId,
      cover_image: coverImageUrl,
      description: safeData.description || null,
      release_date: safeData.releaseDate
        ? new Date(safeData.releaseDate).toISOString()
        : null,
      genre_id: safeData.genreId || null,
      is_published: safeData.isPublished,
      album_type: safeData.albumType,
      is_explicit: safeData.isExplicit,
      record_label: safeData.recordLabel || null,
      copyright: safeData.copyright || null,
      upc: safeData.upc || null,
      language: safeData.language,
    };
    dbData.slug = generateSlug(safeData.title);

    const { data: newAlbum, error: dbError } = await supabase
      .from("album")
      .insert(dbData)
      .select()
      .single();

    if (dbError) {
      console.error(
        "[DB_ERROR_CREATE_ALBUM]:",
        dbError.message,
        dbError.details,
      );
      if (uploadedCoverPath) {
        await supabase.storage.from("covers").remove([uploadedCoverPath]);
      }
      return NextResponse.json(
        { error: "Thêm mới Album không thành công, vui lòng thử lại" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { data: newAlbum, message: "Tạo Album thành công" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("API POST Album Catch Error:", error);
    if (uploadedCoverPath) {
      await supabase.storage.from("covers").remove([uploadedCoverPath]);
    }

    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
