import { z } from "zod";

export const trackFormSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(100, "Tiêu đề quá dài"),
  album_id: z.string().optional(),
  genre_id: z.string().optional(),
  isrc: z.string().optional(),
  release_date: z.string().optional(),
  lyrics: z.string().optional(),
  is_explicit: z.boolean().default(false),
  is_published: z.boolean().default(true),
});

export type TrackFormValues = z.infer<typeof trackFormSchema>;
