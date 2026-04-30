import { PageHeading } from "@/components/page-heading";
import { SearchParams } from "@/types";
import RequestsGrid from "./request-grid";

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeading>Yêu cầu trở thành nghệ sĩ</PageHeading>
          <p className="text-gray-400 mt-1">
            Tất cả các đơn đang 
          </p>
        </div>
      </div>

      <RequestsGrid status={status} page={page} />
    </div>
  );
}
