import { GenreManagementClient } from "@/components/features/admin/genres";
import { PageHeading } from "@/components/ui/page-heading";

export const metadata = {
  title: "Quản lý Thể loại | Echo Admin",
  description: "Trang quản trị danh mục thể loại âm nhạc.",
};

export default function AdminGenresManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeading>Quản lý Thể loại (Genres)</PageHeading>
          <p className="text-muted-foreground mt-1 text-[14px]">
            Tạo mới, phân loại và quản lý màu sắc nhận diện cho các dòng nhạc
            trên hệ thống
          </p>
        </div>
      </div>

      <GenreManagementClient />
    </div>
  );
}
