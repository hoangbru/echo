import { PageHeading } from "@/components/ui/page-heading";
import { ArtistSettingsForm } from "@/components/features/studio/settings";

export default function StudioSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeading>Hồ sơ Nghệ sĩ</PageHeading>
          <p className="text-muted-foreground mt-1 text-[14px]">
            Quản lý hình ảnh thương hiệu và thông tin công khai của bạn trên hệ
            thống.
          </p>
        </div>
      </div>

      <ArtistSettingsForm />
    </div>
  );
}
