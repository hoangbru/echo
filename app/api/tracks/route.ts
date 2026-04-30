import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { generateSlug, removeVietnameseTones } from "@/lib/utils/utils";
import { UserRole } from "@/types";
import { trackFormSchema } from "@/lib/validations/track.schema";
import {
  audioFileSchema,
  imageFileSchema,
} from "@/lib/validations/file.schema";
import { keysToCamel } from "@/lib/utils/format";
import { authorizeApi } from "@/lib/session";

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
      .from("track")
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

    if (error) throw new Error("Đã có lỗi xảy ra khi tải danh sách");

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
  let uploadedAudioPath: string | null = null;
  let uploadedImagePath: string | null = null;
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
          { error: "Admin cần chọn Nghệ sĩ sở hữu bài hát này" },
          { status: 400 },
        );
    }

    const featArtistsStr = formData.get("featArtistIds") as string;
    const featArtistIds = featArtistsStr ? JSON.parse(featArtistsStr) : [];

    const rawGenreId = formData.get("genreId") as string | null;
    const rawData = {
      title: formData.get("title") as string,
      albumId: formData.get("albumId") as string,
      genreId:
        !rawGenreId || rawGenreId.trim() === "" || rawGenreId === "null"
          ? null
          : rawGenreId,
      trackNumber: Number(formData.get("trackNumber")),
      duration: Number(formData.get("duration")) || 0,
      discNumber: Number(formData.get("discNumber")),
      isPublished: formData.get("isPublished") === "true",
      isExplicit: formData.get("isExplicit") === "true",
      isrc: (formData.get("isrc") as string) || "",
      composer: (formData.get("composer") as string) || "",
      producer: (formData.get("producer") as string) || "",
      language: (formData.get("language") as string) || "vi",
      featArtistIds,
    };

    const { data: album } = await supabase
      .from("album")
      .select("cover_image")
      .eq("id", rawData.albumId)
      .single();

    if (!album) {
      return NextResponse.json(
        { error: "Không tìm thấy album" },
        { status: 404 },
      );
    }

    const validatedData = trackFormSchema.safeParse(rawData);
    if (!validatedData.success) {
      const errorMessage = validatedData.error.errors[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    const safeData = validatedData.data;

    const audioFile = formData.get("audioFile") as File | null;
    const audioValidation = audioFileSchema.safeParse(audioFile);
    if (!audioValidation.success) {
      return NextResponse.json(
        { error: audioValidation.error.errors[0].message },
        { status: 400 },
      );
    }
    const validAudio = audioValidation.data;

    let validImage = null;
    const imageFile = formData.get("imageFile") as File | null;
    if (imageFile && imageFile.size > 0) {
      const imageValidation = imageFileSchema.safeParse(imageFile);
      if (!imageValidation.success) {
        return NextResponse.json(
          { error: imageValidation.error.errors[0].message },
          { status: 400 },
        );
      }
      validImage = imageValidation.data;
    }

    // Upload audio file
    const safeAudioName = validAudio.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    uploadedAudioPath = `tracks/artist_${finalArtistId}/audio_${Date.now()}_${safeAudioName}`;

    const { error: audioErr } = await supabase.storage
      .from("audio")
      .upload(uploadedAudioPath, validAudio);

    if (audioErr)
      return NextResponse.json(
        { error: "Tải lên audio không thành công" },
        { status: 400 },
      );

    const audioUrl = supabase.storage
      .from("audio")
      .getPublicUrl(uploadedAudioPath).data.publicUrl;
    const audioFileSize = validAudio.size;

    // Upload image file (Nếu có)
    let imageUrl = null;
    if (validImage) {
      const safeImageName = validImage.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
      uploadedImagePath = `tracks/artist_${finalArtistId}/cover_${Date.now()}_${safeImageName}`;

      const { error: imageErr } = await supabase.storage
        .from("covers")
        .upload(uploadedImagePath, validImage);

      if (imageErr)
        return NextResponse.json(
          { error: "Tải lên ảnh không thành công" },
          { status: 400 },
        );

      imageUrl = supabase.storage.from("covers").getPublicUrl(uploadedImagePath)
        .data.publicUrl;
    }

    const fileSizeInBytes = validAudio.size;

    let calculatedBitrate = null;
    if (audioFileSize && safeData.duration > 0) {
      calculatedBitrate = Math.round(
        (fileSizeInBytes * 8) / safeData.duration / 1000,
      );
    }

    const dbData: any = {
      title: safeData.title,
      album_id: safeData.albumId,
      genre_id: safeData.genreId || null,
      artist_id: finalArtistId,
      audio_url: audioUrl,
      duration: safeData.duration,
      bitrate: calculatedBitrate,
      image_url: imageUrl,
      file_size: audioFileSize,
      track_number: safeData.trackNumber,
      disc_number: safeData.discNumber,
      is_published: safeData.isPublished,
      is_explicit: safeData.isExplicit,
      isrc: safeData.isrc || null,
      composer: safeData.composer || null,
      producer: safeData.producer || null,
      language: safeData.language,
    };
    dbData.slug = generateSlug(safeData.title);

    const { data: newTrack, error: dbError } = await supabase
      .from("track")
      .insert(dbData)
      .select()
      .single();

    if (dbError)
      return NextResponse.json(
        { error: "Không thể tạo mới bài hát" },
        { status: 400 },
      );

    const trackArtistsData = [
      { track_id: newTrack.id, artist_id: finalArtistId, is_main: true },
    ];

    safeData.featArtistIds.forEach((id: string) => {
      trackArtistsData.push({
        track_id: newTrack.id,
        artist_id: id,
        is_main: false,
      });
    });

    const { error: taError } = await supabase
      .from("track_artists")
      .insert(trackArtistsData);
    if (taError)
      return NextResponse.json(
        { error: "Đã có lỗi khi lưu thông tin Nghệ sĩ" },
        { status: 400 },
      );

    return NextResponse.json(
      { data: newTrack, message: "Thêm bài hát thành công" },
      { status: 201 },
    );
  } catch (error: any) {
    if (uploadedAudioPath)
      await supabase.storage.from("audio").remove([uploadedAudioPath]);
    if (uploadedImagePath)
      await supabase.storage.from("covers").remove([uploadedImagePath]);

    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
