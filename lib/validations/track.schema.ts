import { z } from "zod";

export const trackFormSchema = z.object({
  title: z
    .string({ required_error: "Tên bài hát không được để trống" })
    .min(1)
    .max(150),
  albumId: z.string({ required_error: "Bài hát phải thuộc về một Album" }),
  genreId: z.string().nullable().optional(),
  duration: z.number().default(0),
  trackNumber: z.coerce.number().min(1).default(1),
  discNumber: z.coerce.number().min(1).default(1),
  isPublished: z.boolean().default(true),
  isExplicit: z.boolean().default(false),

  isrc: z.string().max(20).optional().or(z.literal("")),
  composer: z.string().max(100).optional().or(z.literal("")),
  producer: z.string().max(100).optional().or(z.literal("")),
  language: z.string().default("vi"),

  featArtistIds: z.array(z.string()).default([]),
});

export type TrackFormValues = z.infer<typeof trackFormSchema>;
