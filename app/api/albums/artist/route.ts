import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { generateSlug, removeVietnameseTones } from "@/lib/utils/utils";
import { albumFormSchema } from "@/lib/validations/album.schema";
import { coverImageSchema } from "@/lib/validations/file.schema";
import { getFilePath } from "@/lib/utils/file";
import { AlbumDB } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để thực hiện" },
        { status: 401 },
      );
    }

    const { data: artist } = await supabase
      .from("artist")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!artist) {
      return NextResponse.json(
        { error: "Không tìm thấy hồ sơ nghệ sĩ" },
        { status: 404 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const genreId = searchParams.get("genre") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query = supabase
      .from("album")
      .select("*, track(count)", { count: "exact" })
      .eq("artist_id", artist.id)
      .order("created_at", { ascending: false });

    if (search) {
      const cleanSearch = removeVietnameseTones(search);
      query = query.ilike("title_search", `%${cleanSearch}%`);
    }

    if (status === "public") query = query.eq("is_published", true);
    if (status === "private") query = query.eq("is_published", false);

    if (genreId !== "all") {
      query = query.eq("genre_id", genreId);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) throw new Error("Lỗi truy vấn: " + error.message);

    const formattedData = (data || []).map((album: AlbumDB) => ({
      id: album.id,
      title: album.title,
      titleSearch: album.title_search,
      releaseDate: album.release_date,
      coverImage: album.cover_image,
      slug: album.slug,
      albumType: album.album_type,
      artistId: album.artist_id,
      description: album.description,
      genreId: album.genre_id,
      isExplicit: album.is_explicit,
      isPublished: album.is_published,
      recordLabel: album.record_label,
      upc: album.upc,
      language: album.language,
      copyright: album.copyright,
      rating: album.rating,
      totalStreams: album.total_streams,
      totalTracks: album.total_tracks,
      createdAt: album.created_at,
      updatedAt: album.updated_at,
    }));

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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để thực hiện" },
        { status: 401 },
      );

    const { data: artist } = await supabase
      .from("artist")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!artist)
      return NextResponse.json(
        { error: "Không tìm thấy hồ sơ nghệ sĩ" },
        { status: 404 },
      );

    const formData = await request.formData();

    const rawData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string | null) || "",
      releaseDate: (formData.get("releaseDate") as string | null) || "",
      genreId: (formData.get("genreId") as string | null) || "",
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

    const fileValidation = coverImageSchema.safeParse(coverFile);
    if (!fileValidation.success) {
      const errorMessage = fileValidation.error.errors[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const safeData = validatedData.data;
    const validFile = fileValidation.data;

    let coverImageUrl = null;

    const safeName = validFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    uploadedCoverPath = `albums/artist_${artist.id}/cover_${Date.now()}_${safeName}`;

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
      artist_id: artist.id,
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

export async function DELETE(request: NextRequest) {
  const supabase = createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để thực hiện" },
        { status: 401 },
      );

    const searchParams = request.nextUrl.searchParams;
    const albumId = searchParams.get("id");

    if (!albumId) {
      return NextResponse.json({ error: "Thiếu ID Album" }, { status: 400 });
    }

    const { data: album } = await supabase
      .from("album")
      .select("cover_image")
      .eq("id", albumId)
      .single();

    if (album?.cover_image) {
      const coverPath = getFilePath(album.cover_image, "covers");

      if (coverPath) await supabase.storage.from("covers").remove([coverPath]);
    }

    const { error: dbError } = await supabase
      .from("album")
      .delete()
      .eq("id", albumId);

    if (dbError) throw new Error("Xoá không thành công" + dbError.message);

    return NextResponse.json(
      { message: "Xóa Album thành công" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("API Delete Album Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
