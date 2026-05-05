import { SupabaseClient } from "@supabase/supabase-js";

export const getFilePath = (url: string, bucket: string) => {
  if (!url) return null;
  const parts = url.split(`${bucket}/`);
  return parts.length > 1 ? parts[1] : null;
};

export const getFileNameFromUrl = (url: string) => {
  if (!url) return "Unknown Audio File";
  try {
    const urlParts = url.split("/");
    const lastPart = urlParts[urlParts.length - 1];
    const decodedName = decodeURIComponent(lastPart);
    const match = decodedName.match(/^audio_\d+_(.+)$/);
    return match && match[1] ? match[1] : decodedName;
  } catch (e) {
    return "Audio File";
  }
};

export interface UploadResult {
  url: string | null;
  path: string | null;
  error: string | null;
}

export async function uploadFileToSupabase(
  supabase: SupabaseClient<any, "public", any>,
  file: File,
  bucket: string,
  pathPrefix: string = ""
): Promise<UploadResult> {
  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    const filePath = pathPrefix
      ? `${pathPrefix}/${Date.now()}_${safeName}`
      : `${Date.now()}_${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { url: null, path: null, error: uploadError.message };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return { url: data.publicUrl, path: filePath, error: null };
  } catch (error: any) {
    return { url: null, path: null, error: error.message };
  }
}