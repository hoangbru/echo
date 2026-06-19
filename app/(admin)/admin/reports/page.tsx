import { ReportManagementClient } from "@/components/features/admin/reports";
import { PageHeading } from "@/components/ui/page-heading";

export const metadata = {
  title: "Quản lý Báo cáo | Echo Admin",
  description: "Trang quản trị các báo cáo vi phạm nội dung từ người dùng.",
};

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeading>Quản lý Báo cáo</PageHeading>
          <p className="text-muted-foreground mt-1 text-[14px]">
            Kiểm duyệt, theo dõi và xử lý các nội dung vi phạm tiêu chuẩn cộng
            đồng.
          </p>
        </div>
      </div>
      <ReportManagementClient />
    </div>
  );
}
