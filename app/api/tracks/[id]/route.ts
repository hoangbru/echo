import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UserRole } from "@/types";
import { getFilePath } from "@/lib/utils/file";
import { trackFormSchema } from "@/lib/validations/track.schema";
import {
  audioFileSchema,
  imageFileSchema,
} from "@/lib/validations/file.schema";
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
      .from("track")
      .select(
        `
        *,
        genre(id, name), 
        album!inner(
          id, 
          title, 
          cover_image, 
          is_published, 
          artist_id,
          genre(id, name)
        ),
        track_artists(
          is_main,
          artist(id, stage_name, profile_image)
        )
      `,
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Không tìm thấy bài hát" },
        { status: 404 },
      );
    }

    const isTrackPrivate = !data.is_published;
    const isAlbumPrivate = !data.album.is_published;

    if (isTrackPrivate || isAlbumPrivate) {
      const isOwner =
        role === UserRole.ARTIST && data.album.artist_id === currentArtistId;
      const isAdmin = role === UserRole.ADMIN;

      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { error: "Bài hát này đang ở chế độ riêng tư." },
          { status: 403 },
        );
      }
    }

    const albumInfo = data.album;
    const finalGenre = data.genre || albumInfo.genre;

    const result = {
      ...data,
      image_url: data.image_url || albumInfo.cover_image,
      genre_id: finalGenre?.id || null,
      genre_name: finalGenre?.name || null,
    };

    delete result.genre;

    const formattedData = keysToCamel(data);

    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (error: any) {
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
  let uploadedAudioPath: string | null = null;
  let uploadedImagePath: string | null = null;
  const supabase = createClient();

  try {
    const { id: trackId } = await params;
    const auth = await authorizeApi([UserRole.ARTIST, UserRole.ADMIN]);
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    const currentArtistId = auth.artistId;

    const { data: oldTrack } = await supabase
      .from("track")
      .select("artist_id, duration, audio_url, image_url, file_size, bitrate")
      .eq("id", trackId)
      .single();

    if (!oldTrack)
      return NextResponse.json(
        { error: "Không tìm thấy bài hát" },
        { status: 404 },
      );

    if (
      auth.role !== UserRole.ADMIN &&
      oldTrack.artist_id !== currentArtistId
    ) {
      return NextResponse.json(
        {
          error: "Bạn không có quyền sửa bài hát này!",
        },
        { status: 403 },
      );
    }

    const formData = await request.formData();
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
      discNumber: Number(formData.get("discNumber")),
      isPublished: formData.get("isPublished") === "true",
      isExplicit: formData.get("isExplicit") === "true",
      isrc: (formData.get("isrc") as string) || "",
      composer: (formData.get("composer") as string) || "",
      producer: (formData.get("producer") as string) || "",
      language: (formData.get("language") as string) || "vi",
      duration: Number(formData.get("duration")) || oldTrack.duration,
      featArtistIds,
    };

    const validatedData = trackFormSchema.safeParse(rawData);
    if (!validatedData.success) {
      const errorMessage = validatedData.error.errors[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    const safeData = validatedData.data;

    let validAudio = null;
    const audioFile = formData.get("audioFile") as File | null;
    if (audioFile && audioFile.size > 0) {
      const audioValidation = audioFileSchema.safeParse(audioFile);
      if (!audioValidation.success) {
        return NextResponse.json(
          { error: audioValidation.error.errors[0].message },
          { status: 400 },
        );
      }
      validAudio = audioValidation.data;
    }

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

    let finalAudioUrl = oldTrack.audio_url;
    let finalFileSize = oldTrack.file_size;

    if (validAudio) {
      const safeAudioName = validAudio.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
      uploadedAudioPath = `tracks/artist_${currentArtistId}/audio_${Date.now()}_${safeAudioName}`;

      const { error: audioErr } = await supabase.storage
        .from("audio")
        .upload(uploadedAudioPath, validAudio);
      if (audioErr) throw new Error("Lỗi tải file âm thanh");

      finalAudioUrl = supabase.storage
        .from("audio")
        .getPublicUrl(uploadedAudioPath).data.publicUrl;
      finalFileSize = validAudio.size;

      if (oldTrack.audio_url) {
        const oldPath = getFilePath(oldTrack.audio_url, "audio");
        if (oldPath) await supabase.storage.from("audio").remove([oldPath]);
      }
    }

    const isRemoveImage = formData.get("removeImage") === "true";
    let finalImageUrl = oldTrack.image_url;

    if (validImage) {
      const safeImageName = validImage.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
      uploadedImagePath = `tracks/artist_${currentArtistId}/cover_${Date.now()}_${safeImageName}`;

      await supabase.storage
        .from("covers")
        .upload(uploadedImagePath, validImage);
      finalImageUrl = supabase.storage
        .from("covers")
        .getPublicUrl(uploadedImagePath).data.publicUrl;

      if (oldTrack.image_url && oldTrack.image_url.includes("/tracks/")) {
        const oldImgPath = getFilePath(oldTrack.image_url, "covers");
        if (oldImgPath)
          await supabase.storage.from("covers").remove([oldImgPath]);
      }
    } else if (isRemoveImage) {
      finalImageUrl = null;
      if (oldTrack.image_url && oldTrack.image_url.includes("/tracks/")) {
        const oldImgPath = getFilePath(oldTrack.image_url, "covers");
        if (oldImgPath)
          await supabase.storage.from("covers").remove([oldImgPath]);
      }
    }

    let calculatedBitrate = oldTrack.bitrate;
    if (finalFileSize && safeData.duration > 0) {
      calculatedBitrate = Math.round(
        (finalFileSize * 8) / safeData.duration / 1000,
      );
    }

    const dbData: any = {
      title: safeData.title,
      audio_url: finalAudioUrl,
      genre_id: safeData.genreId || null,
      image_url: finalImageUrl,
      file_size: finalFileSize,
      duration: safeData.duration,
      bitrate: calculatedBitrate,
      track_number: safeData.trackNumber,
      disc_number: safeData.discNumber,
      is_published: safeData.isPublished,
      is_explicit: safeData.isExplicit,
      isrc: safeData.isrc || null,
      composer: safeData.composer || null,
      producer: safeData.producer || null,
      language: safeData.language,
    };
    const { error: updateError } = await supabase
      .from("track")
      .update(dbData)
      .eq("id", trackId);

    if (updateError) throw updateError;

    await supabase.from("track_artists").delete().eq("track_id", trackId);

    const trackArtistsData = [
      { track_id: trackId, artist_id: currentArtistId, is_main: true },
    ];
    safeData.featArtistIds.forEach((id: string) => {
      trackArtistsData.push({
        track_id: trackId,
        artist_id: id,
        is_main: false,
      });
    });
    await supabase.from("track_artists").insert(trackArtistsData);

    return NextResponse.json(
      { message: "Cập nhật bài hát thành công" },
      { status: 200 },
    );
  } catch (error: any) {
    if (uploadedAudioPath)
      await supabase.storage.from("audio").remove([uploadedAudioPath]);
    if (uploadedImagePath)
      await supabase.storage.from("covers").remove([uploadedImagePath]);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
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
    const { id: trackId } = await params;
    const auth = await authorizeApi([UserRole.ARTIST, UserRole.ADMIN]);
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    const currentArtistId = auth.artistId;

    const { data: oldTrack } = await supabase
      .from("track")
      .select("audio_url, image_url, artist_id")
      .eq("id", trackId)
      .single();

    if (!oldTrack)
      return NextResponse.json(
        { error: "Không tìm thấy bài hát" },
        { status: 404 },
      );

    if (
      auth.role !== UserRole.ADMIN &&
      oldTrack.artist_id !== currentArtistId
    ) {
      return NextResponse.json(
        {
          error: "Bạn không có quyền sửa bài hát này!",
        },
        { status: 403 },
      );
    }

    if (oldTrack.audio_url) {
      const audioPath = getFilePath(oldTrack.audio_url, "audio");
      if (audioPath) {
        await supabase.storage.from("audio").remove([audioPath]);
      }
    }

    if (oldTrack.image_url && oldTrack.image_url.includes("/tracks/")) {
      const imagePath = getFilePath(oldTrack.image_url, "covers");
      if (imagePath) {
        await supabase.storage.from("covers").remove([imagePath]);
      }
    }

    const { error: deleteError } = await supabase
      .from("track")
      .delete()
      .eq("id", trackId);

    if (deleteError) throw deleteError;

    return NextResponse.json(
      { message: "Đã xóa bài hát thành công" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Lỗi khi xóa Track:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}
