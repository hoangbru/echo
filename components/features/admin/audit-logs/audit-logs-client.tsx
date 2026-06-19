"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Activity, Loader2, Search, Filter } from "lucide-react";
import { useAuditLogs } from "@/hooks/use-audit-logs";

export function AuditLogsClient() {
  const [actionFilter, setActionFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: logs, isLoading } = useAuditLogs(actionFilter);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Lọc dữ liệu hiển thị (Client-side Search)
  const filteredLogs = (logs || []).filter(
    (log: any) =>
      log.adminId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-[24px]">
      {/* Thanh công cụ tìm kiếm & lọc */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-card p-4 rounded-[var(--radius)] border border-border">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo mã Admin hoặc tên nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-[4px] pl-10 pr-4 py-2 text-[14px] text-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-background border border-border rounded-[4px] px-3 py-2 text-[14px] text-foreground focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">Tất cả hành động</option>
            <option value="RESOLVE_REPORT_APPROVED">
              Khóa nội dung vi phạm
            </option>
            <option value="RESOLVE_REPORT_REJECTED">Bác bỏ khiếu nại</option>
            <option value="UPDATE_TRACK">Cập nhật Track</option>
            <option value="BAN_USER">Khóa tài khoản</option>
          </select>
        </div>
      </div>

      {/* Bảng Dữ Liệu Log */}
      <div className="bg-card border border-border rounded-[var(--radius)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar relative">
          <table className="w-full text-left text-[14px] border-collapse">
            <thead className="bg-muted/40 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="p-4 font-medium text-muted-foreground border-b border-border w-[180px]">
                  Thời gian
                </th>
                <th className="p-4 font-medium text-muted-foreground border-b border-border">
                  Mã Quản trị viên
                </th>
                <th className="p-4 font-medium text-muted-foreground border-b border-border">
                  Hành động
                </th>
                <th className="p-4 font-medium text-muted-foreground border-b border-border">
                  Đối tượng tác động
                </th>
                <th className="p-4 font-medium text-muted-foreground border-b border-border">
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log: any) => (
                <tr
                  key={log.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4 text-muted-foreground font-mono text-[13px] whitespace-nowrap">
                    {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm:ss")}
                  </td>
                  <td
                    className="p-4 font-mono text-[13px] text-primary max-w-[150px] truncate"
                    title={log.adminId}
                  >
                    {log.adminId}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-background border border-border rounded-md text-[12px] font-bold tracking-wide">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground truncate max-w-[200px]">
                        {log.targetName || "N/A"}
                      </span>
                      <span className="text-[12px] text-muted-foreground">
                        Loại: {log.targetType}
                      </span>
                    </div>
                  </td>
                  <td
                    className="p-4 text-muted-foreground text-[13px] max-w-[300px] truncate"
                    title={log.changes}
                  >
                    {log.changes || "-"}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2"
                  >
                    <Activity className="w-8 h-8 opacity-20" />
                    Không tìm thấy dữ liệu nhật ký phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
