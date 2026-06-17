"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateProfile } from "@/hooks/use-profile";
import { UserProfile } from "@/types";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const ProfileEditModal = ({
  isOpen,
  onClose,
  profile,
}: ProfileEditModalProps) => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  // Sử dụng Hook cập nhật Profile đã viết ở bước trước
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile(profile.id);

  // Đồng bộ dữ liệu khi mở Modal
  useEffect(() => {
    if (profile && isOpen) {
      setFullName(profile.fullName || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setPreviewUrl(profile.avatar || undefined);
      setAvatarFile(null);
    }
  }, [profile, isOpen]);

  // Giải phóng bộ nhớ (Revoke Object URL) để tránh rò rỉ bộ nhớ (Memory Leak)
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Xử lý chọn ảnh xem trước
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Đóng gói dữ liệu và Gửi API
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !fullName.trim()) return;

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("username", username);
    formData.append("bio", bio);

    if (avatarFile) {
      formData.append("avatarFile", avatarFile);
    }

    try {
      await updateProfile(formData);
      onClose();
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="bg-card border-border text-foreground max-w-[520px] p-6 rounded-lg shadow-2xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
          <DialogTitle className="text-[20px] font-bold">
            Chi tiết hồ sơ
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 pt-4">
          <div className="flex gap-6 items-center">
            {/* Vùng hiển thị Avatar: Sử dụng rounded-full thay vì rounded-md */}
            <div className="relative w-[160px] h-[160px] aspect-square bg-muted rounded-full overflow-hidden group/img shadow-md flex-shrink-0">
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt={fullName || "Avatar preview"}
                    fill
                    className="object-cover"
                    unoptimized={previewUrl.startsWith("blob:")}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer z-20">
                    <Camera className="w-8 h-8 text-white" />
                    <input
                      type="file"
                      accept="image/jpg, image/jpeg, image/png"
                      className="absolute inset-0 opacity-0 cursor-pointer z-30"
                      onChange={handleFileChange}
                    />
                    <span className="text-[12px] text-white font-medium">
                      Đổi ảnh
                    </span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 bg-muted border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer z-10">
                  <Camera className="w-10 h-10 text-muted-foreground group-hover/img:text-primary transition-colors duration-300" />
                  <span className="text-[13px] font-medium text-muted-foreground group-hover/img:text-primary transition-colors duration-300">
                    Chọn ảnh
                  </span>
                  <input
                    type="file"
                    accept="image/jpg, image/jpeg, image/png"
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>

            {/* Vùng nhập liệu Tên & Username */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                  placeholder="Tên hiển thị"
                  className="w-full bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-md px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  placeholder="Tên người dùng (Username)"
                  className="w-full bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-md px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Vùng nhập liệu Tiểu sử (Bio) nằm dưới */}
          <div className="flex flex-col gap-1 pt-2">
            <Textarea
              value={bio}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
              placeholder="Thêm tiểu sử giới thiệu về bạn..."
              className="w-full bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-md px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground resize-none min-h-[100px] transition-all custom-scrollbar"
            />
          </div>

          <div className="text-[11px] text-muted-foreground leading-normal mt-2">
            Bằng việc lưu thay đổi, bạn đồng ý cho phép Echo cập nhật hình ảnh và thông tin hiển thị trên toàn hệ thống.
          </div>

          <DialogFooter className="pt-4 border-t border-border mt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform font-bold px-8 py-2 rounded-full ml-auto shadow-md"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu hồ sơ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};