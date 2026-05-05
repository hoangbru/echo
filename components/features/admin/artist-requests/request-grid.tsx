"use client";

import { Fragment, useState } from "react";
import { toast } from "sonner";
import { ArrowUpDown, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

import { Textarea } from "@/components/ui/textarea";
import { RequestItemSkeleton } from "./request-item-skeleton";
import { RequestItem } from "./request-item";
import { ConfirmModal, InfoModal } from "@/components/features/modals";
import {
  DataPagination,
  DataTableToolbar,
  ToolbarDropdownConfig,
} from "@/components/features/data-tables";
import { DetailInfo } from "./detail-info";
import { RefreshButton } from "@/components/shared/buttons";

import { ArtistRequest, ArtistRequestStatus } from "@/types";
import {
  useArtistRequests,
  useUpdateArtistRequest,
} from "@/hooks/use-artist-request";
import { useAuth } from "@/hooks/use-auth";

interface RequestsGridProps {
  page: number;
  status: string;
  search: string;
  sortBy: string;
  sortOrder: string;
  fromDate: string;
  toDate: string;
}

export function RequestsGrid({
  page,
  status,
  search,
  sortBy,
  sortOrder,
  fromDate,
  toDate,
}: RequestsGridProps) {
  const router = useRouter();
  const { user } = useAuth();
  const {
    data: requestsRes,
    isLoading,
    isError,
    refetch,
  } = useArtistRequests({
    status,
    search,
    page,
    sortBy,
    sortOrder,
    fromDate,
    toDate,
  });

  const { mutate: updateRequest, isPending: isUpdating } =
    useUpdateArtistRequest();

  const requests = requestsRes?.data || [];
  const meta = requestsRes?.meta || {
    totalPages: 1,
    currentCount: 0,
    totalCount: 0,
  };

  const [requestToApprove, setRequestToApprove] =
    useState<ArtistRequest | null>(null);
  const [requestToReject, setRequestToReject] = useState<ArtistRequest | null>(
    null,
  );
  const [detailRequest, setDetailRequest] = useState<ArtistRequest | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = () => {
    updateRequest(
      {
        id: requestToApprove?.id,
        user_id: requestToApprove?.userId,
        stage_name: requestToApprove?.stageName,
        profile_image: requestToApprove?.profileImage,
        bio: requestToApprove?.bio,
        social_links: requestToApprove?.socialLinks,
        status: ArtistRequestStatus.APPROVED,
        reviewed_by: user && user.email,
      },
      {
        onSuccess: () => {
          toast.success("Đã duyệt đơn yêu cầu!");
          setRequestToApprove(null);
        },
      },
    );
  };

  const executeReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }
    updateRequest(
      {
        id: requestToReject?.id,
        status: ArtistRequestStatus.REJECTED,
        review_comment: rejectReason,
        reviewed_by: user && user.email,
      },
      {
        onSuccess: () => {
          toast.success("Đã từ chối đơn yêu cầu!");
          setRequestToReject(null);
          setRejectReason("");
        },
      },
    );
  };

  const renderTableHeaders = () => {
    if (status === "PENDING") {
      return (
        <>
          <th className="py-4 px-4 w-1/3">Nghệ sĩ</th>
          <th className="py-4 px-4">Mạng xã hội</th>
          <th className="py-4 px-4">Ngày gửi</th>
        </>
      );
    }
    if (status === "REJECTED") {
      return (
        <>
          <th className="py-4 px-4">Nghệ sĩ</th>
          <th className="py-4 px-4 w-1/3">Người duyệt</th>
          <th className="py-4 px-4">Ngày xử lý</th>
        </>
      );
    }
    if (status === "APPROVED") {
      return (
        <>
          <th className="py-4 px-4">Nghệ sĩ</th>
          <th className="py-4 px-4">Người duyệt</th>
          <th className="py-4 px-4">Ngày xử lý</th>
        </>
      );
    }
    // "all"
    return (
      <>
        <th className="py-4 px-4">Nghệ sĩ</th>
        <th className="py-4 px-4">Trạng thái</th>
        <th className="py-4 px-4">Ngày gửi</th>
      </>
    );
  };

  const requestDropdowns: ToolbarDropdownConfig[] = [
    {
      key: "status",
      value: status,
      icon: <Filter className="w-4 h-4" />,
      options: [
        { label: "Tất cả trạng thái", value: "all" },
        { label: "Chờ xác nhận", value: ArtistRequestStatus.PENDING },
        { label: "Đã chấp nhận", value: ArtistRequestStatus.APPROVED },
        { label: "Từ chối", value: ArtistRequestStatus.REJECTED },
      ],
    },
    {
      key: "sortBy",
      value: sortBy,
      icon: <ArrowUpDown className="w-4 h-4" />,
      options: [
        { label: "Ngày gửi", value: "created_at" },
        { label: "Nghệ danh", value: "stage_name" },
      ],
    },
    {
      key: "sortOrder",
      value: sortOrder,
      options: [
        { label: "Mới nhất / Z-A", value: "desc" },
        { label: "Cũ nhất / A-Z", value: "asc" },
      ],
    },
  ];

  return (
    <Fragment>
      <DataTableToolbar
        searchPlaceholder="Tìm kiếm nghệ danh hoặc email..."
        searchValue={search}
        dropdowns={requestDropdowns}
        showDateRange={true}
        fromDateValue={fromDate}
        toDateValue={toDate}
      />

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm mt-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 text-muted-foreground text-xs font-bold uppercase tracking-wider border-b border-border">
              <th className="py-4 px-4 w-12 text-center">#</th>
              {renderTableHeaders()}
              <th className="py-4 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <RequestItemSkeleton key={idx} currentStatus={status} />
              ))
            ) : isError ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <RefreshButton onRefresh={() => refetch()} />
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-20 text-center text-muted-foreground font-medium"
                >
                  Không có đơn đăng ký nào.
                </td>
              </tr>
            ) : (
              requests.map((req: any, index: number) => (
                <RequestItem
                  key={req.id}
                  index={(page - 1) * 10 + index + 1}
                  request={req}
                  currentStatus={status}
                  onApprove={() => setRequestToApprove(req)}
                  onRejectClick={() => setRequestToReject(req)}
                  onViewDetail={() => setDetailRequest(req)}
                  isUpdating={isUpdating}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <DataPagination
        currentPage={page}
        totalPages={meta.totalPages}
        currentCount={meta.currentCount}
        totalCount={meta.totalCount}
        onPageChange={(newPage) => {
          router.push(`?status=${status}&page=${newPage}`);
        }}
        itemName="đơn đăng ký"
      />

      <ConfirmModal
        isOpen={!!requestToApprove}
        onClose={() => setRequestToApprove(null)}
        onConfirm={handleApprove}
        title="Duyệt đơn yêu cầu"
        description={
          <div className="flex flex-col gap-3 text-muted-foreground">
            <p>
              Chấp nhận yêu cầu trở thành nghệ sĩ của{" "}
              <span className="text-foreground font-bold">
                {requestToApprove?.stageName}
              </span>
              ?
            </p>
          </div>
        }
        confirmText="Xác nhận"
        cancelText="Huỷ"
        isProcessing={isUpdating}
      />

      <ConfirmModal
        isOpen={!!requestToReject}
        onClose={() => {
          setRequestToReject(null);
          setRejectReason("");
        }}
        onConfirm={executeReject}
        title="Từ chối đơn yêu cầu"
        description={
          <div className="flex flex-col gap-3 text-muted-foreground mt-2">
            <p>
              Từ chối yêu cầu trở thành nghệ sĩ của{" "}
              <span className="text-foreground font-bold">
                {requestToReject?.stageName}
              </span>
              ?
            </p>
            <Textarea
              placeholder="Nhập lý do từ chối (bắt buộc)..."
              className="bg-background border-border text-foreground mt-2 placeholder:text-muted-foreground focus-visible:ring-primary"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
        }
        confirmText="Xác nhận từ chối"
        cancelText="Huỷ"
        isProcessing={isUpdating}
      />

      <InfoModal
        isOpen={!!detailRequest}
        onClose={() => setDetailRequest(null)}
        title="Chi tiết đơn đăng ký"
        description={<DetailInfo detailRequest={detailRequest} />}
      />
    </Fragment>
  );
}
