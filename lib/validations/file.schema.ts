import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constants/file";

export const coverImageSchema = z
  .custom<File>((val) => val instanceof File, "Vui lòng chọn ảnh")
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "Kích thước ảnh quá lớn. Tối đa là 5MB",
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Định dạng ảnh không hợp lệ. Chỉ chấp nhận .jpg, .jpeg, .png, .webp",
  );
