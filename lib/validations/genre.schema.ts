import { z } from "zod";

export const genreSchema = z.object({
  name: z
    .string({ required_error: "Tên thể loại không được để trống." })
    .trim()
    .min(2, "Tên thể loại phải có ít nhất 2 ký tự.")
    .max(50, "Tên thể loại quá dài (tối đa 50 ký tự)."),
  description: z
    .string()
    .trim()
    .max(500, "Mô tả không được vượt quá 500 ký tự.")
    .optional()
    .or(z.literal("")),
});

export type GenreFormValues = z.infer<typeof genreSchema>;
