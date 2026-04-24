import { CreateTrackParams, UpdateTrackParams } from "@/types";
import { createClient } from "../supabase/client";
import { getFilePath } from "../utils/file";

export const TrackService = {
  async getTrendingTracks(supabase: any, limit: number = 10) {
    return await supabase
      .from("track")
      .select(`*`)
      .eq("is_published", true)
      .order("total_streams", { ascending: false })
      .limit(limit);
  },

  async getNewReleases(supabase: any, limit: number = 10) {
    return await supabase
      .from("track")
      .select(`*`)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(limit);
  },

  async getTrackById(supabase: any, trackId: string) {
    return await supabase
      .from("track")
      .select("*")
      .eq("is_published", true)
      .eq("id", trackId)
      .single();
  },

  async createTrack({
    formData,
    artistId,
    musicFile,
    coverFile,
    selectedAlbumCover,
    duration,
  }: CreateTrackParams) {
    const supabase = createClient();

    let uploadedAudioPath: string | null = null;
    let uploadedCoverPath: string | null = null;

    try {
      const safeName = musicFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
      uploadedAudioPath = `artist_${artistId}/audio_${Date.now()}_${safeName}`;

      const { error: audioErr } = await supabase.storage
        .from("tracks")
        .upload(uploadedAudioPath, musicFile);

      if (audioErr)
        throw new Error("Lỗi tải lên file âm thanh: " + audioErr.message);

      const audioUrl = supabase.storage
        .from("tracks")
        .getPublicUrl(uploadedAudioPath).data.publicUrl;

      let trackImageUrl: string | null = null;

      if (coverFile) {
        uploadedCoverPath = `tracks/artist_${artistId}/cover_${Date.now()}`;
        const { error: coverErr } = await supabase.storage
          .from("covers")
          .upload(uploadedCoverPath, coverFile);

        if (coverErr)
          throw new Error("Lỗi tải lên ảnh bìa: " + coverErr.message);

        trackImageUrl = supabase.storage
          .from("covers")
          .getPublicUrl(uploadedCoverPath).data.publicUrl;
      } else if (selectedAlbumCover) {
        trackImageUrl = selectedAlbumCover;
      }

      const { error: dbError } = await supabase.from("track").insert({
        title: formData.title,
        artist_id: artistId,
        album_id: formData.album_id || null,
        duration,
        audio_url: audioUrl,
        image_url: trackImageUrl,
        lyrics: formData.lyrics || null,
        is_explicit: formData.is_explicit,
        genre_id: formData.genre_id || null,
        is_published: formData.is_published,
        isrc: formData.isrc || null,
        release_date: formData.release_date
          ? new Date(formData.release_date).toISOString()
          : new Date().toISOString(),
      });

      if (dbError)
        throw new Error(
          "Đã có lỗi xảy ra khi tải lên bài hát: " + dbError.message,
        );

      return true;
    } catch (error: any) {
      console.error("Lỗi Upload:", error);

      if (uploadedAudioPath) {
        await supabase.storage.from("tracks").remove([uploadedAudioPath]);
      }
      if (uploadedCoverPath) {
        await supabase.storage.from("covers").remove([uploadedCoverPath]);
      }

      throw error;
    }
  },

  async updateTrack({
    trackId,
    artistId,
    formData,
    coverFile,
    oldCoverUrl,
    clearCustomCover,
    albumCoverUrl,
  }: UpdateTrackParams) {
    const supabase = createClient();

    let newCoverUrl = oldCoverUrl;
    let newCoverPath: string | null = null;

    try {
      if (coverFile) {
        const safeName = coverFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
        newCoverPath = `tracks/artist_${artistId}/cover_${Date.now()}_${safeName}`;

        const { error: coverErr } = await supabase.storage
          .from("covers")
          .upload(newCoverPath, coverFile);

        if (coverErr)
          throw new Error("Lỗi tải lên ảnh bìa mới: " + coverErr.message);

        newCoverUrl = supabase.storage.from("covers").getPublicUrl(newCoverPath)
          .data.publicUrl;
      } else if (clearCustomCover && albumCoverUrl) {
        newCoverUrl = albumCoverUrl;
      }

      const { error: dbError } = await supabase
        .from("track")
        .update({
          title: formData.title,
          album_id: formData.album_id || null,
          genre_id: formData.genre_id || null,
          lyrics: formData.lyrics || null,
          is_explicit: formData.is_explicit,
          is_published: formData.is_published,
          image_url: newCoverUrl,
          release_date: formData.release_date
            ? new Date(formData.release_date).toISOString()
            : null,
        })
        .eq("id", trackId);

      if (dbError)
        throw new Error("Không thể cập nhật bài hát: " + dbError.message);

      if (
        (coverFile || clearCustomCover) &&
        oldCoverUrl &&
        oldCoverUrl !== newCoverUrl
      ) {
        const oldPath = getFilePath(oldCoverUrl, "covers");

        if (oldPath && oldPath.includes("tracks/")) {
          await supabase.storage.from("covers").remove([oldPath]);
        }
      }

      return true;
    } catch (error: any) {
      console.error("Lỗi cập nhật bài hát:", error);

      if (newCoverPath) {
        await supabase.storage.from("covers").remove([newCoverPath]);
      }

      throw error;
    }
  },

  async removeTrack(supabase: any, trackId: string) {
    const { data: track, error: fetchError } = await supabase
      .from("track")
      .select("audio_url, image_url")
      .eq("id", trackId)
      .single();

    if (fetchError) {
      console.error("Không tìm thấy bài hát hoặc đã có lỗi xảy ra!");
      return false;
    }

    const audioPath = getFilePath(track.audio_url, "tracks");
    const coverPath = getFilePath(track.image_url, "covers");

    if (audioPath) await supabase.storage.from("tracks").remove([audioPath]);
    if (coverPath) await supabase.storage.from("covers").remove([coverPath]);

    const { error: deleteError } = await supabase
      .from("track")
      .delete()
      .eq("id", trackId);

    if (deleteError) {
      console.error("Lỗi khi xóa bài hát khỏi cơ sở dữ liệu!");
      return false;
    }

    return true;
  },
};
