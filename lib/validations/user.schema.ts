import { z } from "zod";

export const userFormSchema = z.object({
  username: z
    .string()
    .min(3, "Tên người dùng (username) phải có ít nhất 3 ký tự")
    .max(20, "Tên người dùng (username) không được vượt quá 20 ký tự")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Tên người dùng chỉ được chứa chữ cái không dấu, số và dấu gạch dưới (_), không chứa khoảng trắng",
    ),

  fullName: z
    .string()
    .min(1, "Tên hiển thị không được để trống")
    .max(50, "Tên hiển thị không được vượt quá 50 ký tự")
    .refine(
      (val) => val.trim().length > 0,
      "Tên hiển thị không được chứa toàn bộ khoảng trắng",
    ),

  bio: z
    .string()
    .max(
      160,
      "Tiểu sử (bio) không được vượt quá 160 ký tự để đảm bảo tối ưu hiển thị giao diện Echo",
    )
    .nullable()
    .optional()
    .or(z.literal("")),
});

export type UserFormInput = z.infer<typeof userFormSchema>;
