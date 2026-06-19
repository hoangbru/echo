import { AnalyticsView } from "@/components/features/studio/stats";
import { PageHeading } from "@/components/ui/page-heading";

export default async function StudioAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeading>Phân tích số liệu</PageHeading>
          <p className="text-muted-foreground mt-1 text-[14px]">
            Nghiên cứu hành vi khán giả và hiệu suất các bản ghi âm của bạn.
          </p>
        </div>
      </div>

      <AnalyticsView />
    </div>
  );
}
