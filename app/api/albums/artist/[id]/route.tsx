import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { albumFormSchema } from "@/lib/validations/album.schema";
import { coverImageSchema } from "@/lib/validations/file.schema";
import { getFilePath } from "@/lib/utils/file";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = createClient();
  let newUploadedPath: string | null = null;

  try {
    const { id } = await params;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để thực hiện" },
        { status: 401 },
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

    const validatedData = albumFormSchema.safeParse(rawData);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors[0].message },
        { status: 400 },
      );
    }
    const safeData = validatedData.data;

    const { data: oldAlbum } = await supabase
      .from("album")
      .select("cover_image")
      .eq("id", id)
      .single();

    const newCoverFile = formData.get("coverFile") as File | null;
    let coverImageUrl = oldAlbum?.cover_image;

    if (newCoverFile && newCoverFile.size > 0) {
      const fileValidation = coverImageSchema.safeParse(newCoverFile);
      if (!fileValidation.success) {
        return NextResponse.json(
          { error: fileValidation.error.errors[0].message },
          { status: 400 },
        );
      }

      const safeName = newCoverFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
      newUploadedPath = `albums/artist_${user.id}/cover_${Date.now()}_${safeName}`;
      const { error: upError } = await supabase.storage
        .from("covers")
        .upload(newUploadedPath, newCoverFile);
      if (upError) throw new Error("Lỗi tải ảnh mới: " + upError.message);

      coverImageUrl = supabase.storage
        .from("covers")
        .getPublicUrl(newUploadedPath).data.publicUrl;

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
      .eq("id", id);

    if (dbError) throw new Error("Lỗi cập nhật DB: " + dbError.message);

    return NextResponse.json(
      { message: "Cập nhật thành công!" },
      { status: 200 },
    );
  } catch (error: any) {
    if (newUploadedPath)
      await supabase.storage.from("covers").remove([newUploadedPath]);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
