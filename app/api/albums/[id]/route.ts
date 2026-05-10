import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UserRole } from "@/types";
import { albumFormSchema } from "@/lib/validations/album.schema";
import { imageFileSchema } from "@/lib/validations/file.schema";
import { getFilePath, uploadFileToSupabase } from "@/lib/utils/file";
import { authorizeApi } from "@/lib/session";
import { keysToCamel } from "@/lib/utils/format";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = createClient();

    const auth = await authorizeApi();
    const role = auth.error ? "GUEST" : auth.role;
    const currentArtistId = auth.artistId;

    const { data, error } = await supabase
      .from("album")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error) console.error("[GET_ALBUM_DB_ERROR]", error);
      return NextResponse.json(
        { error: "Không tìm thấy dữ liệu album yêu cầu" },
        { status: 404 },
      );
    }

    if (!data.is_published) {
      const isOwner =
        role === UserRole.ARTIST && data.artist_id === currentArtistId;
      const isAdmin = role === UserRole.ADMIN;

      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { error: "Album này đang ở chế độ riêng tư" },
          { status: 403 },
        );
      }
    }

    const formattedData = keysToCamel(data);

    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_ALBUM_FATAL_ERROR]", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống trong quá trình lấy thông tin" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = createClient();
  let newUploadedPath: string | null = null;

  try {
    const { id: albumId } = await params;
    const auth = await authorizeApi([UserRole.ARTIST, UserRole.ADMIN]);

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const currentArtistId = auth.artistId;

    const { data: oldAlbum, error: oldAlbumError } = await supabase
      .from("album")
      .select("artist_id, cover_image")
      .eq("id", albumId)
      .single();

    if (oldAlbumError || !oldAlbum) {
      if (oldAlbumError)
        console.error("[PATCH_ALBUM_NOT_FOUND]", oldAlbumError);
      return NextResponse.json(
        { error: "Không tìm thấy album để cập nhật" },
        { status: 404 },
      );
    }

    if (
      auth.role !== UserRole.ADMIN &&
      oldAlbum.artist_id !== currentArtistId
    ) {
      return NextResponse.json(
        { error: "Bạn không có quyền chỉnh sửa album này" },
        { status: 403 },
      );
    }

    const formData = await request.formData();
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

    const validatedData = albumFormSchema.safeParse(rawData);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors[0].message },
        { status: 400 },
      );
    }

    const safeData = validatedData.data;
    const newCoverFile = formData.get("coverFile") as File | null;
    let coverImageUrl = oldAlbum?.cover_image;

    if (newCoverFile && newCoverFile.size > 0) {
      const fileValidation = imageFileSchema.safeParse(newCoverFile);
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
        `albums/artist_${currentArtistId}`,
      );

      if (imgErr) {
        console.error("[STORAGE_ERROR_UPDATE_ALBUM_COVER]:", imgErr);
        return NextResponse.json(
          { error: "Tải lên ảnh bìa mới thất bại" },
          { status: 400 },
        );
      }

      coverImageUrl = imgUrl;
      newUploadedPath = iPath;

      if (oldAlbum?.cover_image) {
        const oldPath = getFilePath(oldAlbum.cover_image, "covers");
        if (oldPath) await supabase.storage.from("covers").remove([oldPath]);
      }
    }

    const dbData: any = {
      title: safeData.title,
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

    const { error: dbError } = await supabase
      .from("album")
      .update(dbData)
      .eq("id", albumId);

    if (dbError) {
      console.error("[DB_UPDATE_ERROR]", dbError);
      if (newUploadedPath)
        await supabase.storage.from("covers").remove([newUploadedPath]);
      return NextResponse.json(
        { error: "Không thể cập nhật thông tin album" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Cập nhật thành công" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[PATCH_ALBUM_FATAL_ERROR]", error);
    if (newUploadedPath)
      await supabase.storage.from("covers").remove([newUploadedPath]);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống trong quá trình cập nhật" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = createClient();

  try {
    const { id: albumId } = await params;
    if (!albumId) {
      return NextResponse.json(
        { error: "Thiếu dữ liệu định danh Album" },
        { status: 400 },
      );
    }

    const auth = await authorizeApi([UserRole.ARTIST, UserRole.ADMIN]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data: oldAlbum, error: oldAlbumError } = await supabase
      .from("album")
      .select("artist_id, cover_image")
      .eq("id", albumId)
      .single();

    if (oldAlbumError || !oldAlbum) {
      if (oldAlbumError)
        console.error("[DELETE_ALBUM_NOT_FOUND]", oldAlbumError);
      return NextResponse.json(
        { error: "Không tìm thấy album để xóa" },
        { status: 404 },
      );
    }

    if (auth.role !== UserRole.ADMIN && oldAlbum.artist_id !== auth.artistId) {
      return NextResponse.json(
        { error: "Bạn không có quyền xóa album này" },
        { status: 403 },
      );
    }

    const { data: tracks, error: tracksError } = await supabase
      .from("track")
      .select("audio_url, image_url")
      .eq("album_id", albumId);

    if (tracksError) {
      console.error("[DELETE_ALBUM_FETCH_TRACKS_ERROR]", tracksError);
    }

    const audioPaths =
      tracks?.map((t) => t.audio_url.split("/audio/")[1]).filter(Boolean) || [];
    const trackImagePaths =
      tracks
        ?.map((t) => t.image_url?.split("/covers/")[1])
        .filter((p) => p && p.includes("tracks/")) || [];

    if (audioPaths.length > 0) {
      const { error: audioRmError } = await supabase.storage
        .from("audio")
        .remove(audioPaths);
      if (audioRmError)
        console.error("[STORAGE_AUDIO_REMOVE_ERROR]", audioRmError);
    }

    if (trackImagePaths.length > 0) {
      const { error: imgRmError } = await supabase.storage
        .from("covers")
        .remove(trackImagePaths);
      if (imgRmError)
        console.error("[STORAGE_TRACK_COVERS_REMOVE_ERROR]", imgRmError);
    }

    if (oldAlbum?.cover_image) {
      const coverPath = getFilePath(oldAlbum.cover_image, "covers");
      if (coverPath) {
        const { error: coverRmError } = await supabase.storage
          .from("covers")
          .remove([coverPath]);
        if (coverRmError)
          console.error("[STORAGE_ALBUM_COVER_REMOVE_ERROR]", coverRmError);
      }
    }

    const { error: dbError } = await supabase
      .from("album")
      .delete()
      .eq("id", albumId);

    if (dbError) {
      console.error("[DB_DELETE_ALBUM_ERROR]", dbError);
      return NextResponse.json(
        { error: "Không thể xóa album lúc này" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Xóa Album thành công" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[DELETE_ALBUM_FATAL_ERROR]", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống trong quá trình xóa" },
      { status: 500 },
    );
  }
}
