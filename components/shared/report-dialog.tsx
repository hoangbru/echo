"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/axios";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetName: string;
  targetType: "TRACK" | "ALBUM" | "PLAYLIST" | "ARTIST";
}

const REPORT_TYPES = [
  { value: "COPYRIGHT", label: "Vi phạm bản quyền" },
  { value: "NSFW", label: "Nội dung nhạy cảm / Phản cảm" },
  { value: "SPAM", label: "Spam / Lừa đảo" },
  { value: "OTHER", label: "Lý do khác" },
];

export function ReportDialog({
  isOpen,
  onClose,
  targetId,
  targetName,
  targetType,
}: ReportDialogProps) {
  const [reportType, setReportType] = useState("COPYRIGHT");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do báo cáo ngắn gọn.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/reports", {
        reportType,
        targetId,
        targetName,
        targetType,
        reason,
        description,
      });

      toast.success(
        "Báo cáo đã được gửi. Cảm ơn bạn đã góp phần xây dựng cộng đồng Echo.",
      );

      setReason("");
      setDescription("");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Lỗi khi gửi báo cáo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground z-[10000]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Báo cáo nội dung
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-[14px]">
            Bạn đang báo cáo {targetType === "TRACK" ? "bản ghi" : "nội dung"}:{" "}
            <span className="font-bold text-foreground">{targetName}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-foreground">
              Loại vi phạm *
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-[14px] text-foreground focus:outline-none focus:border-primary"
            >
              {REPORT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-foreground">
              Tiêu đề lý do *
            </label>
            <input
              required
              type="text"
              placeholder="Ví dụ: Bài hát chứa từ ngữ thù ghét"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-[14px] text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-foreground">
              Mô tả chi tiết (Tùy chọn)
            </label>
            <textarea
              rows={3}
              placeholder="Cung cấp thêm ngữ cảnh hoặc mốc thời gian vi phạm (nếu có)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-[14px] text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="px-4 py-2 text-[14px] font-medium bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Gửi báo cáo
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
