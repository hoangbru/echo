import { AuditLogsClient } from "@/components/features/admin/audit-logs";
import { PageHeading } from "@/components/ui/page-heading";
import { ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Nhật ký Hệ thống | Echo Admin",
  description: "Theo dõi thao tác quản trị và kiểm toán bảo mật.",
};

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 border-b border-border pb-6">
          <div className="p-3 bg-destructive/10 text-destructive rounded-[var(--radius)]">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <PageHeading>Nhật ký Hệ thống</PageHeading>
            <p className="text-muted-foreground mt-1 text-[14px]">
              Hộp đen lưu trữ toàn bộ thao tác phân quyền, kiểm duyệt nội dung
              và thay đổi trạng thái từ Quản trị viên.
            </p>
          </div>
        </div>
      </div>

      <AuditLogsClient />
    </div>
  );
}
