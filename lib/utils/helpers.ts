import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@/lib/supabase/server";
import { authorizeApi } from "@/lib/session";
import { UserRole } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

export function generateSlug(title: string) {
  const baseSlug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const randomString = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomString}`;
}

export const sortedObj = (vnp_Params: any) => {
  return Object.keys(vnp_Params)
    .sort()
    .reduce((obj: any, key: string) => {
      obj[key] = vnp_Params[key];
      return obj;
    }, {});
};

export async function resolvePlaylistOwnership(
  supabase: ReturnType<typeof createClient>,
  playlistId: string,
  auth: Awaited<ReturnType<typeof authorizeApi>>,
): Promise<{ error: string; status: number } | null> {
  const { data, error } = await supabase
    .from("playlist")
    .select("user_id")
    .eq("id", playlistId)
    .single();
 
  if (error || !data) {
    return { error: "Không tìm thấy playlist", status: 404 };
  }
 
  const isAdmin = auth.role === UserRole.ADMIN;
  const isOwner = data.user_id === auth.user.id;

  if (!isOwner && !isAdmin) {
    return { error: "Bạn không có quyền chỉnh sửa playlist này", status: 403 };
  }
 
  return null;
}