import { CreateAlbumParams, UpdateAlbumParams } from "@/types";
import { getFilePath } from "../utils/file";
import { createClient } from "../supabase/client";
import { toast } from "sonner";

export const AlbumService = {
  async getById(supabase: any, albumId: string) {
    const { data, error } = await supabase
      .from("album")
      .select("*")
      .eq("id", albumId)
      .maybeSingle();

    if (error) {
      console.error("Đã có lỗi xảy ra", error.message);
      return null;
    }

    return data;
  },

  async create({ artistId, formData, coverFile }: CreateAlbumParams) {
    const supabase = createClient();

    let uploadedCoverPath: string | null = null;

    let coverImageUrl: string | null = null;

    if (coverFile) {
      uploadedCoverPath = `albums/artist_${artistId}/cover_${Date.now()}`;
      const { error: coverErr } = await supabase.storage
        .from("covers")
        .upload(uploadedCoverPath, coverFile);

      if (coverErr) throw new Error("Lỗi tải lên ảnh bìa: " + coverErr.message);

      coverImageUrl = supabase.storage
        .from("covers")
        .getPublicUrl(uploadedCoverPath).data.publicUrl;
    }

    const { error } = await supabase.from("album").insert({
      title: formData.title,
      artist_id: artistId,
      cover_image: coverImageUrl,
      description: formData.description || null,
      release_date: formData.release_date
        ? new Date(formData.release_date).toISOString()
        : null,
      genre_id: formData.genre_id || null,
      is_published: formData.is_published,
    });

    if (error && uploadedCoverPath) {
      await supabase.storage.from("covers").remove([uploadedCoverPath]);
      return false;
    }

    return true;
  },

  async update({
    albumId,
    artistId,
    formData,
    coverFile,
    oldCoverUrl,
  }: UpdateAlbumParams) {
    const supabase = createClient();

    let newCoverUrl = oldCoverUrl;
    let newCoverPath: string | null = null;

    try {
      if (coverFile) {
        const safeName = coverFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
        newCoverPath = `albums/artist_${artistId}/cover_${Date.now()}_${safeName}`;

        const { error } = await supabase.storage
          .from("covers")
          .upload(newCoverPath, coverFile);

        if (error)
          toast.error(
            "Đã có lỗi trong quá trình tải lên, vui lòng thử lại sau!",
          );

        newCoverUrl = supabase.storage.from("covers").getPublicUrl(newCoverPath)
          .data.publicUrl;
      }

      const { error } = await supabase
        .from("album")
        .update({
          title: formData.title,
          genre_id: formData.genre_id || null,
          description: formData.description,
          is_published: formData.is_published,
          image_url: newCoverUrl,
          release_date: formData.release_date
            ? new Date(formData.release_date).toISOString()
            : null,
        })
        .eq("id", albumId);

      if (error) {
        toast.error("Không thể cập nhật bài hát, vui lòng thử lại sau!");
      }

      if (coverFile && oldCoverUrl) {
        const oldPath = getFilePath(oldCoverUrl, "covers");

        if (oldPath && oldPath.includes("albums/")) {
          await supabase.storage.from("covers").remove([oldPath]);
        }
      }

      return true;
    } catch (error) {
      console.error("Lỗi cập nhật bài hát:", error);

      if (newCoverPath) {
        await supabase.storage.from("covers").remove([newCoverPath]);
      }

      throw error;
    }
  },

  async remove(supabase: any, albumId: string) {
    const { data, error } = await supabase
      .from("album")
      .select("cover_image")
      .eq("id", albumId)
      .single();

    if (error) {
      console.error("Không tìm thấy album hoặc đã có lỗi xảy ra!");
      return false;
    }

    const coverPath = getFilePath(data.cover_image, "covers");

    if (coverPath) await supabase.storage.from("covers").remove([coverPath]);

    await supabase.from("album").delete().eq("id", albumId);

    return true;
  },
};
