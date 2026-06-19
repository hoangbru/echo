import { UserManagement } from "@/components/features/admin/users";
import { PageHeading } from "@/components/ui/page-heading";

export const metadata = {
  title: "Quản lý Người dùng | Echo Admin",
  description: "Trang quản trị tài khoản người dùng.",
};

export default function AdminUsersManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeading>Quản lý Người dùng</PageHeading>
          <p className="text-muted-foreground mt-1 text-[14px]">
            Theo dõi, quản lý trạng thái và xử lý vi phạm tài khoản người nghe
          </p>
        </div>
      </div>
      <UserManagement />
    </div>
  );
}
