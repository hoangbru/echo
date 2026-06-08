import { z } from "zod";

export const playlistFormSchema = z.object({
  title: z
    .string({ required_error: "Tên playlist không được để trống." })
    .trim()
    .min(1, { message: "Vui lòng nhập tên playlist." })
    .max(100, { message: "Tên playlist quá dài (tối đa 100 ký tự)." }),

  description: z
    .string()
    .trim()
    .max(1000, { message: "Mô tả không được vượt quá 1000 ký tự." })
    .nullish(),

  isPublic: z.boolean().default(true),
});

export type PlaylistFormValues = z.infer<typeof playlistFormSchema>;
