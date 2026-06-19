"use client";

import { useState } from "react";
import { Search, Loader2, Plus, Music4, icons } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateAdminGenre, useGenres } from "@/hooks/use-genres";

const DynamicIcon = ({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) => {
  if (!name) return <Music4 className={className} />;

  const LucideIcon = icons[name as keyof typeof icons];
  if (!LucideIcon) return <Music4 className={className} />;

  return <LucideIcon className={className} />;
};

export function GenreManagementClient() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [icon, setIcon] = useState("");

  const { data: response, isLoading } = useGenres({ q: search });
  const createMutation = useCreateAdminGenre();

  const genres = response?.data || [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createMutation.mutateAsync({
      name,
      description,
      color,
      icon: icon.trim() || undefined,
    });

    setIsModalOpen(false);
    setName("");
    setDescription("");
    setColor("#3b82f6");
    setIcon("");
  };

  return (
    <div className="space-y-6">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm thể loại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-2 text-[14px] text-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="font-medium text-[14px] flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Thêm thể loại
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm Thể loại Mới</DialogTitle>
              <DialogDescription>
                Tạo danh mục âm nhạc mới cho hệ thống. Thông tin này sẽ hiển thị
                trên toàn bộ ứng dụng.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-foreground">
                  Tên thể loại <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Vinahouse, Lofi Chill..."
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-[14px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-foreground">
                  Mô tả chi tiết
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Đặc điểm nhận dạng của dòng nhạc này..."
                  rows={3}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-[14px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-foreground">
                  Màu sắc nhận diện (Color)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 p-1 bg-background border border-input rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-[14px] text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-foreground">
                  Đường dẫn Icon (URL) hoặc Tên Icon
                </label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="VD: https://.../icon.png hoặc 'Music'"
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-[14px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <DialogFooter className="pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || !name.trim()}
                  className="flex items-center gap-2"
                >
                  {createMutation.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  Lưu thể loại
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-[var(--radius)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-muted/40 sticky top-0 z-10">
              <tr>
                <th className="p-4 font-medium text-muted-foreground border-b border-border w-[100px] text-center">
                  Biểu tượng
                </th>
                <th className="p-4 font-medium text-muted-foreground border-b border-border">
                  Tên thể loại
                </th>
                <th className="p-4 font-medium text-muted-foreground border-b border-border">
                  Mô tả
                </th>
                <th className="p-4 font-medium text-muted-foreground border-b border-border text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : genres.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-12 text-center text-muted-foreground"
                  >
                    <Music4 className="w-8 h-8 opacity-20 mx-auto mb-2" />
                    Không tìm thấy thể loại nào.
                  </td>
                </tr>
              ) : (
                genres.map((genre: any) => (
                  <tr
                    key={genre.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex justify-center">
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center shadow-sm border border-border/50"
                          style={{
                            backgroundColor: genre.color
                              ? `${genre.color}20`
                              : "var(--muted)",
                            color: genre.color || "var(--foreground)",
                          }}
                          title={genre.icon || "Default Icon"}
                        >
                          <DynamicIcon name={genre.icon} className="w-4 h-4" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-foreground">{genre.name}</p>
                      {genre.icon && (
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          Icon: {genre.icon}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground max-w-[300px] truncate">
                      {genre.description || "Không có mô tả"}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-primary hover:underline text-[13px] font-medium">
                        Chỉnh sửa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
