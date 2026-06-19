import { ArtistManagementClient } from "@/components/features/admin/artists";
import { PageHeading } from "@/components/ui/page-heading";

export const metadata = {
  title: "Quản lý Nghệ sĩ | Echo Admin",
  description: "Trang quản trị hồ sơ nghệ sĩ và cấp quyền xác minh.",
};

export default function AdminArtistsManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeading>Quản lý Hồ sơ Nghệ sĩ</PageHeading>
          <p className="text-muted-foreground mt-1 text-[14px]">
            Theo dõi danh sách, kiểm duyệt và cấp huy hiệu xác minh (tích xanh)
            cho nghệ sĩ
          </p>
        </div>
      </div>
      <ArtistManagementClient />
    </div>
  );
}
