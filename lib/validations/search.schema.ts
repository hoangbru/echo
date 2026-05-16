import z from "zod";

export const searchSchema = z.object({
  q: z.string().min(1, "Query is required").max(200),
  types: z.string().default("track,artist,album"),
});
