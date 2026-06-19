"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Flag,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useReports, useResolveReport } from "@/hooks/use-admin-reports";
import { cn } from "@/lib/utils/helpers";

export function ReportManagementClient() {
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PENDING" | "RESOLVED"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const { data: reports, isLoading } = useReports(statusFilter);
  const { resolveReport, isResolving } = useResolveReport();

  const handleResolve = async (action: "APPROVE" | "REJECT") => {
    if (!selectedReport) return;
    try {
      await resolveReport({ reportId: selectedReport.id, action });
      toast.success("Đã xử lý báo cáo thành công.");
      setSelectedReport(null);
    } catch (error: any) {
      toast.error("Lỗi khi xử lý báo cáo.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredReports = (reports || []).filter(
    (r: any) =>
      r.targetName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-[24px]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tên nội dung hoặc lý do..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-[4px] pl-10 pr-4 py-2 text-[14px] text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-background border border-border rounded-[4px] px-3 py-2 text-[14px] text-foreground focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chưa xử lý (Pending)</option>
            <option value="RESOLVED">Đã xử lý (Resolved)</option>
          </select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[var(--radius)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead className="text-muted-foreground bg-muted/30 border-b border-border">
              <tr>
                <th className="p-4 font-medium">Thời gian</th>
                <th className="p-4 font-medium">Đối tượng</th>
                <th className="p-4 font-medium">Phân loại</th>
                <th className="p-4 font-medium">Lý do báo cáo</th>
                <th className="p-4 font-medium text-center">Trạng thái</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReports.map((report: any) => (
                <tr
                  key={report.id}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <td className="p-4 text-muted-foreground font-mono text-[13px]">
                    {format(new Date(report.createdAt), "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-foreground truncate max-w-[200px]">
                      {report.targetName}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {report.targetType}
                    </p>
                  </td>
                  <td className="p-4 text-foreground">
                    <span className="px-2 py-1 bg-background border border-border rounded-[4px] text-[12px] font-medium">
                      {report.reportType}
                    </span>
                  </td>
                  <td className="p-4 text-foreground truncate max-w-[250px]">
                    {report.reason}
                  </td>
                  <td className="p-4 text-center">
                    {report.status === "PENDING" ? (
                      <span className="px-2.5 py-1 rounded-full text-[12px] font-bold flex items-center justify-center gap-1 w-max mx-auto bg-orange-500/10 text-orange-500">
                        <AlertCircle className="w-3 h-3" /> PENDING
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[12px] font-bold flex items-center justify-center gap-1 w-max mx-auto",
                          report.resolutionAction === "APPROVE"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {report.resolutionAction === "APPROVE"
                          ? "ĐÃ KHÓA VI PHẠM"
                          : "ĐÃ BÁC BỎ"}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-[4px] text-[13px] font-medium transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-muted-foreground"
                  >
                    Không tìm thấy báo cáo nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={!!selectedReport}
        onOpenChange={(open) => !open && setSelectedReport(null)}
      >
        {selectedReport && (
          <DialogContent className="sm:max-w-[600px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground text-[20px]">
                <Flag className="w-5 h-5 text-destructive" />
                Chi tiết Báo cáo
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-md border border-border">
                <div>
                  <p className="text-[12px] text-muted-foreground font-medium mb-1">
                    ĐỐI TƯỢNG BỊ BÁO CÁO
                  </p>
                  <p className="text-[14px] text-foreground font-bold">
                    {selectedReport.targetName}
                  </p>
                  <p className="text-[12px] text-primary mt-1">
                    Loại: {selectedReport.targetType}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-muted-foreground font-medium mb-1">
                    NGƯỜI GỬI (ID)
                  </p>
                  <p className="text-[13px] text-foreground font-mono truncate">
                    {selectedReport.reporterId}
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-1">
                    {format(
                      new Date(selectedReport.createdAt),
                      "dd/MM/yyyy HH:mm:ss",
                    )}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[13px] text-muted-foreground font-medium mb-1">
                  PHÂN LOẠI VI PHẠM
                </p>
                <span className="px-3 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded-[4px] text-[13px] font-bold">
                  {selectedReport.reportType}
                </span>
              </div>

              <div>
                <p className="text-[13px] text-muted-foreground font-medium mb-1">
                  LÝ DO NGẮN GỌN
                </p>
                <p className="text-[15px] text-foreground font-medium bg-background border border-border p-3 rounded-md">
                  {selectedReport.reason}
                </p>
              </div>

              <div>
                <p className="text-[13px] text-muted-foreground font-medium mb-1">
                  MÔ TẢ CHI TIẾT
                </p>
                <p className="text-[14px] text-foreground bg-background border border-border p-3 rounded-md min-h-[80px] whitespace-pre-wrap">
                  {selectedReport.description || "Không có mô tả thêm."}
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
              {selectedReport.status === "PENDING" ? (
                <>
                  <button
                    onClick={() => handleResolve("REJECT")}
                    disabled={isResolving}
                    className="px-4 py-2 border border-border text-foreground rounded-md hover:bg-muted transition-colors text-[14px] font-medium"
                  >
                    Bác bỏ (Báo cáo sai)
                  </button>
                  <button
                    onClick={() => handleResolve("APPROVE")}
                    disabled={isResolving}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors flex items-center gap-2 text-[14px] font-medium"
                  >
                    {isResolving && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Chấp thuận & Khóa nội dung
                  </button>
                </>
              ) : (
                <div className="flex w-full justify-between items-center">
                  <span
                    className={cn(
                      "text-[13px] font-bold px-3 py-1.5 rounded-md",
                      selectedReport.resolutionAction === "APPROVE"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    Kết quả:{" "}
                    {selectedReport.resolutionAction === "APPROVE"
                      ? "Đã xác nhận vi phạm & Khóa nội dung"
                      : "Báo cáo sai - Đã giữ lại nội dung"}
                  </span>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-[14px] font-medium"
                  >
                    Đóng
                  </button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
