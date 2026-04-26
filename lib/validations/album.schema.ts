import { AlbumType } from "@/types";
import { z } from "zod";

export const albumFormSchema = z.object({
  title: z
    .string({ required_error: "Tên Album không được để trống." })
    .trim()
    .min(1, { message: "Vui lòng nhập tên Album." })
    .max(100, { message: "Tên Album quá dài (tối đa 100 ký tự)." }),

  description: z
    .string()
    .trim()
    .max(1000, { message: "Mô tả không được vượt quá 1000 ký tự." })
    .optional()
    .or(z.literal("")),

  genreId: z.string().nullable().optional(),
  releaseDate: z.string().optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
  isExplicit: z.boolean().default(false),
  albumType: z
    .enum(Object.values(AlbumType) as [string, ...string[]])
    .default("ALBUM"),

  recordLabel: z
    .string()
    .max(100, "Tên hãng đĩa quá dài")
    .optional()
    .or(z.literal("")),
  copyright: z
    .string()
    .max(150, "Thông tin bản quyền quá dài")
    .optional()
    .or(z.literal("")),
  upc: z.string().max(50, "Mã UPC không hợp lệ").optional().or(z.literal("")),
  language: z.string().max(10).default("vi"),
});

export type AlbumFormValues = z.infer<typeof albumFormSchema>;
