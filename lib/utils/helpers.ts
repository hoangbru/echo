import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
