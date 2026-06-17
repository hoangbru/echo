"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { Image as ImageIcon, Loader2, Globe, Lock } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { useUpdatePlaylist } from "@/hooks/use-playlists";

interface PlaylistEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: any;
  onSuccess: () => void;
}

export const PlaylistEditModal = ({
  isOpen,
  onClose,
  playlist,
  onSuccess,
}: PlaylistEditModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isPublic, setIsPublic] = useState(true);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const { mutateAsync: updatePlaylist, isPending } = useUpdatePlaylist(
    playlist?.id || "",
  );

  useEffect(() => {
    if (playlist && isOpen) {
      setName(playlist.title || playlist.name || "");
      setDescription(playlist.description || "");
      setPreviewUrl(playlist.coverImage || "/default-cover.jpg");
      setIsPublic(playlist.isPublic !== false);
      setCoverFile(null);
    }
  }, [playlist, isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formData = new FormData();
    formData.append("title", name);
    formData.append("description", description);
    formData.append("isPublic", String(isPublic));

    if (coverFile) {
      formData.append("coverFile", coverFile);
    }

    try {
      await updatePlaylist(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi cập nhật danh sách phát:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="bg-card border-border text-foreground max-w-[520px] p-6 rounded-lg shadow-xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
          <DialogTitle className="text-[20px] font-bold">
            Sửa thông tin chi tiết
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 pt-4">
          <div className="flex gap-4">
            {/* Vùng hiển thị và Chọn ảnh */}
            <div className="relative w-[180px] h-[180px] aspect-square bg-muted rounded-md overflow-hidden group/img shadow-md">
              {previewUrl && previewUrl !== "/default-cover.jpg" ? (
                <>
                  <Image
                    src={previewUrl}
                    alt={name || "Cover preview"}
                    fill
                    className="object-cover"
                    unoptimized={previewUrl.startsWith("blob:")}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer z-20">
                    <ImageIcon className="w-8 h-8 text-white" />
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
                  <ImageIcon className="w-10 h-10 text-muted-foreground group-hover/img:text-primary transition-colors duration-300" />
                  <span className="text-[13px] font-medium text-muted-foreground group-hover/img:text-primary transition-colors duration-300">
                    Chọn ảnh bìa
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

            <div className="flex-1 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  placeholder="Thêm tên"
                  className="w-full bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-md px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground transition-all"
                  required
                />
              </div>

              <div className="flex-1 flex flex-col">
                <Textarea
                  value={description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Thêm mô tả tùy chọn"
                  className="w-full flex-1 bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-md px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground resize-none min-h-[100px] transition-all custom-scrollbar"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-muted/30 p-3 rounded-md border border-border mt-2">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-semibold text-foreground flex items-center gap-2">
                {isPublic ? (
                  <Globe className="w-4 h-4 text-primary" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
                Công khai
              </span>
              <span className="text-[12px] text-muted-foreground">
                {isPublic
                  ? "Mọi người có thể tìm kiếm và xem danh sách phát này."
                  : "Chỉ mình bạn mới có thể xem danh sách phát này."}
              </span>
            </div>

            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
              disabled={isPending}
            />
          </div>

          <div className="text-[11px] text-muted-foreground leading-normal mt-2">
            Bằng việc tiếp tục, bạn đồng ý cho phép Echo truy cập vào hình ảnh
            bạn đã chọn để tải lên. Hãy đảm bảo bạn có quyền sở hữu hợp pháp đối
            với hình ảnh này.
          </div>

          <DialogFooter className="pt-4 border-t border-border mt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform font-bold px-8 py-2 rounded-full ml-auto shadow-md"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
