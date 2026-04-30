import z from "zod";

export const artistRequestSchema = z.object({
  id: z.string().optional().or(z.literal("")),
  userId: z.string().optional(),
  stageName: z.string().min(1, "Tên nghệ sĩ phải có ít nhất 1 ký tự"),
  bio: z.string().min(10, "Tiểu sử nên chi tiết một chút (ít nhất 10 ký tự)"),
  
  contactEmail: z.string().email("Email không hợp lệ"),
  demoLink: z.string().url("Vui lòng nhập link URL hợp lệ (Soundcloud, Youtube, Drive...)"),
  profileImage: z.string().url("Vui lòng nhập link ảnh hợp lệ").optional().or(z.literal("")),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với cam kết bản quyền",
  }),

  facebook: z.string().url("Link không hợp lệ").optional().or(z.literal("")),
  instagram: z.string().url("Link không hợp lệ").optional().or(z.literal("")),
  youtube: z.string().url("Link không hợp lệ").optional().or(z.literal("")),
  reviewComment: z.string().optional().or(z.literal("")),
  reviewedBy: z.string().email().optional().or(z.literal("")),
});

export type ArtistRequestFormValues = z.infer<typeof artistRequestSchema>;