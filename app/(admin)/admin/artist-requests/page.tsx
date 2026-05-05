import { RequestsGrid } from "@/components/features/admin/artist-requests";
import { PageHeading } from "@/components/ui/page-heading";

import { SearchParams } from "@/types";

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;

  const page =
    typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page) : 1;
  const status =
    typeof resolvedParams.status === "string" ? resolvedParams.status : "all";
  const search =
    typeof resolvedParams.search === "string" ? resolvedParams.search : "";
  const sortBy =
    typeof resolvedParams.sortBy === "string"
      ? resolvedParams.sortBy
      : "created_at";
  const sortOrder =
    typeof resolvedParams.sortOrder === "string"
      ? resolvedParams.sortOrder
      : "desc";
  const fromDate =
    typeof resolvedParams.fromDate === "string" ? resolvedParams.fromDate : "";
  const toDate =
    typeof resolvedParams.toDate === "string" ? resolvedParams.toDate : "";

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeading>Yêu cầu trở thành nghệ sĩ</PageHeading>
          <p className="text-muted-foreground mt-1">
            Quản lý và xét duyệt các đơn đăng ký
          </p>
        </div>
      </div>

      <RequestsGrid
        page={page}
        status={status}
        search={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        fromDate={fromDate}
        toDate={toDate}
      />
    </div>
  );
}
