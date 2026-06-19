import { AnalyticsClient } from "@/components/features/admin/analytics";

export const metadata = {
  title: "Thống kê Hệ thống | Echo Admin",
  description: "Theo dõi hiệu suất nền tảng và thông tin người dùng",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Phân tích Số liệu
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Theo dõi hiệu suất nền tảng và insight người dùng
        </p>
      </div>

      <AnalyticsClient />
    </div>
  );
}
