"use client";

import {
  Edit2,
  Trash2,
  Play,
  Pause,
  Globe,
  Lock,
  MoreVertical,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function TrackItem({
  track,
  onEdit,
  onDelete,
}: {
  track: any;
  onEdit: (t: any) => void;
  onDelete: (track: any) => Promise<void>;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(track);
    setIsDeleting(false);
    setOpen(false);
  };

  return (
    <tr className="group border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 group/cover">
            <Image
              src={track.imageUrl || "/default-cover.jpg"}
              alt={track.title}
              fill
              className="object-cover"
            />
            <button
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white fill-white" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white" />
              )}
            </button>
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium truncate">{track.title}</p>
            <p className="text-xs text-gray-500">{track.isrc || "No ISRC"}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-sm text-gray-400">
        {track.Genre?.name || "N/A"}
      </td>
      <td className="py-4 px-4 text-sm text-gray-400">
        {new Date(track.releaseDate).toLocaleDateString("vi-VN")}
      </td>
      <td className="py-4 px-4">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
            track.isPublished
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
          }`}
        >
          {track.isPublished ? (
            <Globe className="w-3 h-3" />
          ) : (
            <Lock className="w-3 h-3" />
          )}
          {track.isPublished ? "Public" : "Private"}
        </div>
      </td>
      <td className="py-4 px-4 text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(track)}
            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
          >
            <Edit2 className="w-4 h-4" />
          </Button>

          {/* MODAL XÁC NHẬN XÓA */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#18181b] border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Xóa bài hát này?</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Hành động này sẽ xóa vĩnh viễn bài hát{" "}
                  <span className="text-white font-bold">"{track.title}"</span>{" "}
                  và toàn bộ file âm thanh, hình ảnh liên quan. Bạn không thể
                  hoàn tác.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  disabled={isDeleting}
                  className="hover:bg-white/5"
                >
                  Huỷ
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Xác nhận xóa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </td>
    </tr>
  );
}
