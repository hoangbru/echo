import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeApi } from "@/lib/session";
import { keysToCamel } from "@/lib/utils/format";
import { getFilePath, uploadFileToSupabase } from "@/lib/utils/file";
import { imageFileSchema } from "@/lib/validations/file.schema";
import { UserRole } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: playlistId } = await params;
    const supabase = createClient();

    const auth = await authorizeApi();
    const role = auth.error ? "GUEST" : auth.role;
    const currentUserId = auth.user?.id ?? null;

    const { data, error } = await supabase
      .from("playlist")
      .select(
        `
        *,
        user:user_id(id, username, avatar),
        playlist_track(
          added_at,
          position,
          track(
            id, title, slug, duration, audio_url, image_url,
            is_explicit, is_published,
            album(id, title, cover_image),
            track_artists(
              is_main,
              artist(id, stage_name, profile_image)
            ),
            genre(id, name)
          )
        )
      `,
      )
      .eq("id", playlistId)
      .single();

    if (error) {
      console.error("[GET_PLAYLIST_DB_ERROR]:", error);
      return NextResponse.json(
        { error: "Không tìm thấy playlist yêu cầu" },
        { status: 404 },
      );
    }

    if (!data.is_public) {
      const isOwner = !!currentUserId && data.user_id === currentUserId;
      const isAdmin = role === UserRole.ADMIN;

      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { error: "Playlist này đang ở chế độ riêng tư" },
          { status: 403 },
        );
      }
    }

    const isOwner =
      !!currentUserId &&
      (data.user_id === currentUserId || role === UserRole.ADMIN);

    const tracks = (data.playlist_track || [])
      .filter((pt: any) => isOwner || pt.track?.is_published)
      .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
      .map((pt: any) => {
        const t = pt.track;
        if (!t) return null;

        const albumRaw = Array.isArray(t.album) ? t.album[0] : t.album;

        const artists = (t.track_artists ?? [])
          .map((ta: any) => {
            const a = Array.isArray(ta.artist) ? ta.artist[0] : ta.artist;
            return {
              id: a?.id ?? null,
              stage_name: a?.stage_name ?? null,
              profile_image: a?.profile_image ?? null,
              is_main: ta.is_main ?? false,
            };
          })
          .sort((a: any, b: any) =>
            a.is_main === b.is_main ? 0 : a.is_main ? -1 : 1,
          );

        return {
          id: t.id,
          title: t.title,
          slug: t.slug,
          duration: t.duration,
          audio_url: t.audio_url,
          image_url: t.image_url ?? albumRaw?.cover_image ?? null,
          is_explicit: t.is_explicit,
          is_published: t.is_published,
          artists,
          album: albumRaw
            ? {
                id: albumRaw.id,
                title: albumRaw.title,
                cover_image: albumRaw.cover_image,
              }
            : null,
          genre: t.genre ?? null,
          added_at: pt.added_at,
          position: pt.position,
        };
      })
      .filter(Boolean);

    const { playlist_track: _, ...playlistMeta } = data;
    const formattedData = keysToCamel({ ...playlistMeta, tracks });

    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (error: any) {
    console.error("[GET_PLAYLIST_FATAL_ERROR]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống khi tải playlist" },
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
    const { id: playlistId } = await params;

    const auth = await authorizeApi([
      UserRole.USER,
      UserRole.ARTIST,
      UserRole.ADMIN,
    ]);

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data: existing, error: fetchError } = await supabase
      .from("playlist")
      .select("user_id, cover_image")
      .eq("id", playlistId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: "Không tìm thấy playlist để cập nhật" },
        { status: 404 },
      );
    }

    const isAdmin = auth.role === UserRole.ADMIN;
    const isOwner = existing.user_id === auth.user?.id;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Bạn không có quyền chỉnh sửa playlist này" },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const title = (formData.get("title") as string | null)?.trim();
    const description =
      (formData.get("description") as string | null)?.trim() ?? undefined;
    const isPublicRaw = formData.get("isPublic");
    const coverFile = formData.get("coverFile") as File | null;
    const removeCover = formData.get("removeCover") === "true";

    if (title !== undefined && title !== null && title.length === 0) {
      return NextResponse.json(
        { error: "Tên playlist không được để trống" },
        { status: 400 },
      );
    }

    if (title && title.length > 100) {
      return NextResponse.json(
        { error: "Tên playlist không được vượt quá 100 ký tự" },
        { status: 400 },
      );
    }

    let coverImageUrl: string | null | undefined = undefined; // undefined = no change

    if (removeCover) {
      // Explicitly remove existing cover
      if (existing.cover_image) {
        const oldPath = getFilePath(existing.cover_image, "covers");
        if (oldPath) await supabase.storage.from("covers").remove([oldPath]);
      }
      coverImageUrl = null;
    } else if (coverFile && coverFile.size > 0) {
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
        `playlists/${existing.user_id}`,
      );

      if (imgErr) {
        console.error("[PATCH_PLAYLIST_COVER_UPLOAD_ERROR]:", imgErr);
        return NextResponse.json(
          { error: "Tải lên ảnh bìa mới thất bại" },
          { status: 400 },
        );
      }

      // Delete old cover after successful upload
      if (existing.cover_image) {
        const oldPath = getFilePath(existing.cover_image, "covers");
        if (oldPath) await supabase.storage.from("covers").remove([oldPath]);
      }

      coverImageUrl = imgUrl;
      newUploadedPath = iPath;
    }

    // Build update payload — only include fields that were actually sent
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (title !== undefined && title !== null) updatePayload.title = title;
    if (description !== undefined)
      updatePayload.description = description || null;
    if (isPublicRaw !== null) updatePayload.is_public = isPublicRaw !== "false";
    if (coverImageUrl !== undefined) updatePayload.cover_image = coverImageUrl;

    const { error: dbError } = await supabase
      .from("playlist")
      .update(updatePayload)
      .eq("id", playlistId);

    if (dbError) {
      console.error("[PATCH_PLAYLIST_DB_ERROR]:", dbError);
      if (newUploadedPath)
        await supabase.storage.from("covers").remove([newUploadedPath]);
      return NextResponse.json(
        { error: "Không thể cập nhật playlist" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Cập nhật playlist thành công" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[PATCH_PLAYLIST_FATAL_ERROR]:", error);
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
    const { id: playlistId } = await params;
    if (!playlistId) {
      return NextResponse.json(
        { error: "Thiếu dữ liệu định danh Playlist" },
        { status: 400 },
      );
    }

    const auth = await authorizeApi([
      UserRole.USER,
      UserRole.ARTIST,
      UserRole.ADMIN,
    ]);

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data: existing, error: fetchError } = await supabase
      .from("playlist")
      .select("user_id, cover_image")
      .eq("id", playlistId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: "Không tìm thấy playlist để xóa" },
        { status: 404 },
      );
    }

    const isAdmin = auth.role === UserRole.ADMIN;
    const isOwner = existing.user_id === auth.user?.id;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Bạn không có quyền xóa playlist này" },
        { status: 403 },
      );
    }

    // Remove cover image from storage first
    if (existing.cover_image) {
      const coverPath = getFilePath(existing.cover_image, "covers");
      if (coverPath) {
        const { error: storageErr } = await supabase.storage
          .from("covers")
          .remove([coverPath]);
        if (storageErr)
          console.error("[DELETE_PLAYLIST_COVER_REMOVE_ERROR]:", storageErr);
      }
    }

    const { error: dbError } = await supabase
      .from("playlist")
      .delete()
      .eq("id", playlistId);

    if (dbError) {
      console.error("[DELETE_PLAYLIST_DB_ERROR]:", dbError);
      return NextResponse.json(
        { error: "Không thể xóa playlist lúc này" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Xóa playlist thành công" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[DELETE_PLAYLIST_FATAL_ERROR]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống trong quá trình xóa" },
      { status: 500 },
    );
  }
}
