import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { generateSlug, removeVietnameseTones } from "@/lib/utils/utils";
import { albumFormSchema } from "@/lib/validations/album.schema";
import { imageFileSchema } from "@/lib/validations/file.schema";
import { UserRole } from "@/types";
import { authorizeApi } from "@/lib/session";
import { keysToCamel } from "@/lib/utils/format";

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

    if (error) throw new Error("Đã có lỗi xảy ra");

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
    return NextResponse.json({ error: error.message }, { status: 500 });
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
        throw new Error("Admin cần chọn Nghệ sĩ sở hữu Album này");
    }

    const rawGenreId = formData.get("genreId") as string | null;
    const rawData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string | null) || "",
      releaseDate: (formData.get("releaseDate") as string | null) || "",
      genreId: (!rawGenreId || rawGenreId.trim() === "" || rawGenreId === "null") ? null : rawGenreId,
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

    const fileValidation = imageFileSchema.safeParse(coverFile);
    if (!fileValidation.success) {
      const errorMessage = fileValidation.error.errors[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const safeData = validatedData.data;
    const validFile = fileValidation.data;

    let coverImageUrl = null;

    const safeName = validFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    uploadedCoverPath = `albums/artist_${finalArtistId}/cover_${Date.now()}_${safeName}`;

    const { error: coverErr } = await supabase.storage
      .from("covers")
      .upload(uploadedCoverPath, validFile);

    if (coverErr)
      throw new Error("Tải lên không thành công" + coverErr.message);

    coverImageUrl = supabase.storage
      .from("covers")
      .getPublicUrl(uploadedCoverPath).data.publicUrl;

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

    if (dbError)
      throw new Error("Thêm mới không thành công!" + dbError.message);

    return NextResponse.json(
      { data: newAlbum, message: "Tạo Album thành công!" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("API Create Album Error:", error);

    if (uploadedCoverPath) {
      await supabase.storage.from("covers").remove([uploadedCoverPath]);
    }

    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
