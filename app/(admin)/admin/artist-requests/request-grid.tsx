"use client";

import { Fragment, useState } from "react";
import { toast } from "sonner";
import { Loader2, AlertCircle, RefreshCcw, User } from "lucide-react";
import { siFacebook, siYoutube, siInstagram } from "simple-icons";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  useArtistRequests,
  useUpdateArtistRequest,
} from "@/hooks/use-artist-request";
import { RequestToolbar } from "./request-toolbar";
import { RequestItemSkeleton } from "./request-item-skeleton";
import { RequestItem } from "./request-item";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import DataPagination from "@/components/data-pagination";
import { useRouter } from "next/navigation";
import { ArtistRequest, ArtistRequestStatus } from "@/types";
import { cn } from "@/lib/utils/utils";
import { useAuth } from "@/hooks/use-auth";
import { BrandIcon } from "@/components/icons/brand-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RequestsGridProps {
  status: string;
  page: number;
}

export default function RequestsGrid({ status, page }: RequestsGridProps) {
  const router = useRouter();
  const { user } = useAuth();
  const {
    data: requestsRes,
    isLoading,
    isError,
    refetch,
  } = useArtistRequests({ status, page });

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
          <th className="py-4 px-4 w-1/3">Nghệ sĩ & Thông tin</th>
          <th className="py-4 px-4">Mạng xã hội</th>
          <th className="py-4 px-4">Ngày gửi</th>
        </>
      );
    }
    if (status === "REJECTED") {
      return (
        <>
          <th className="py-4 px-4">Nghệ sĩ</th>
          <th className="py-4 px-4 w-1/3">Lý do từ chối</th>
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

  return (
    <Fragment>
      <RequestToolbar currentStatus={status} />

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl mt-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background/50 text-muted-foreground text-xs font-bold uppercase tracking-wider border-b border-border/50">
              <th className="py-4 px-4 w-12 text-center">#</th>
              {renderTableHeaders()}
              <th className="py-4 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <RequestItemSkeleton key={idx} currentStatus={status} />
              ))
            ) : isError ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <AlertCircle className="w-10 h-10 text-red-500/50" />
                    <p className="text-red-400 font-medium">
                      Đã có lỗi xảy ra khi tải danh sách.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => refetch()}
                      className="border-white/10 text-gray-300"
                    >
                      <RefreshCcw className="w-4 h-4 mr-2" /> Thử lại
                    </Button>
                  </div>
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-20 text-center text-muted-foreground"
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
        onClose={() => {
          setRequestToApprove(null);
        }}
        onConfirm={handleApprove}
        title="Duyệt đơn yêu cầu"
        description={
          <div className="flex flex-col gap-3">
            <p>
              Chấp nhận yêu cầu trở thành nghệ sĩ của{" "}
              <span className="text-white font-bold">
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
          <div className="flex flex-col gap-3">
            <p>
              Từ chối yêu cầu trở thành nghệ sĩ của{" "}
              <span className="text-white font-bold">
                {requestToReject?.stageName}
              </span>
              ?
            </p>
            <Textarea
              placeholder="Nhập lý do từ chối (bắt buộc)..."
              className="bg-black/50 border-white/10 text-white mt-2"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
        }
        confirmText="Xác nhận từ chối"
        cancelText="Huỷ"
        isProcessing={isUpdating}
      />

      <ConfirmModal
        isOpen={!!detailRequest}
        onClose={() => setDetailRequest(null)}
        onConfirm={() => setDetailRequest(null)}
        title="Chi tiết đơn đăng ký"
        description={
          <div className="flex flex-col gap-4 text-sm text-gray-300 mt-4 text-left">
            {/* --- HEADER MODAL CÓ CHỨA ẢNH PROFILE --- */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
              <Avatar className="w-16 h-16 border-2 border-white/10 shadow-lg">
                {/* detailRequest.profile_image là link URL ảnh từ DB */}
                <AvatarImage
                  src={detailRequest?.profileImage}
                  alt={detailRequest?.stageName || "Artist"}
                  className="object-cover"
                />
                {/* Fallback khi ảnh lỗi hoặc không có ảnh: Hiện icon User trên nền xám */}
                <AvatarFallback className="bg-background/80 text-muted-foreground border border-border">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>

              <div>
                <span className="text-sm font-medium text-gray-500 block mb-1">
                  Tên Nghệ sĩ:
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {detailRequest?.stageName || "Nghệ sĩ vô danh"}
                </h2>
              </div>
            </div>
            <div>
              <span className="font-bold text-gray-500">Tên Nghệ sĩ:</span>{" "}
              <span className="text-white text-base ml-2">
                {detailRequest?.stageName}
              </span>
            </div>

            <div>
              <span className="font-bold text-gray-500">Tiểu sử (Bio):</span>{" "}
              <p className="mt-1 bg-white/5 p-3 rounded">
                {detailRequest?.bio || "Không có"}
              </p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg border border-white/5 mt-2">
              <div className="mb-2">
                <span className="font-bold text-gray-500">Email liên hệ:</span>{" "}
                <a
                  href={`mailto:${detailRequest?.contactEmail}`}
                  className="text-white ml-2 hover:underline"
                >
                  {detailRequest?.contactEmail || "Không có"}
                </a>
              </div>

              <div>
                <span className="font-bold text-gray-500">Link Demo:</span>
                {detailRequest?.demoLink ? (
                  <a
                    href={detailRequest.demoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary font-bold ml-2 hover:underline inline-flex items-center gap-1"
                  >
                    Nghe thử tác phẩm
                  </a>
                ) : (
                  <span className="text-red-400 ml-2">Chưa cung cấp</span>
                )}
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className="font-bold text-gray-500">
                  Cam kết bản quyền:
                </span>
                {detailRequest?.agreedToTerms ? (
                  <span className="text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded text-xs">
                    Đã cam kết
                  </span>
                ) : (
                  <span className="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded text-xs">
                    Chưa cam kết
                  </span>
                )}
              </div>
            </div>

            <div className="bg-black/30 p-4 rounded-lg border border-white/5 mt-2">
              <span className="font-bold text-gray-500 mb-2 block">
                Mạng xã hội:
              </span>
              <div className="flex flex-wrap items-center gap-4 bg-white/5 p-3 rounded-md border border-white/5">
                {(detailRequest?.socialLinks as any)?.facebook && (
                  <a
                    href={(detailRequest?.socialLinks as any).facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:opacity-75 transition-opacity"
                  >
                    <BrandIcon icon={siFacebook} className="w-5 h-5" />
                    <span className="text-sm font-medium text-gray-300">
                      Facebook
                    </span>
                  </a>
                )}

                {(detailRequest?.socialLinks as any)?.youtube && (
                  <a
                    href={(detailRequest?.socialLinks as any).youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:opacity-75 transition-opacity"
                  >
                    <BrandIcon icon={siYoutube} className="w-5 h-5" />
                    <span className="text-sm font-medium text-gray-300">
                      YouTube
                    </span>
                  </a>
                )}

                {(detailRequest?.socialLinks as any)?.instagram && (
                  <a
                    href={(detailRequest?.socialLinks as any).instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:opacity-75 transition-opacity"
                  >
                    <BrandIcon icon={siInstagram} className="w-5 h-5" />
                    <span className="text-sm font-medium text-gray-300">
                      Instagram
                    </span>
                  </a>
                )}

                {/* Nếu không có mạng xã hội nào */}
                {!(detailRequest?.socialLinks as any)?.facebook &&
                  !(detailRequest?.socialLinks as any)?.youtube &&
                  !(detailRequest?.socialLinks as any)?.instagram && (
                    <span className="text-gray-500 italic text-sm">
                      Chưa cung cấp liên kết nào
                    </span>
                  )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2 border-t border-white/10 pt-4">
              <div>
                <span className="font-bold text-gray-500 block">Ngày gửi:</span>{" "}
                {detailRequest?.createdAt
                  ? new Date(detailRequest.createdAt).toLocaleDateString(
                      "vi-VN",
                    )
                  : "N/A"}
              </div>
              <div>
                <span className="font-bold text-gray-500 block">
                  Cập nhật lúc:
                </span>{" "}
                {detailRequest?.updatedAt
                  ? new Date(detailRequest.updatedAt).toLocaleDateString(
                      "vi-VN",
                    )
                  : "N/A"}
              </div>

              {detailRequest?.reviewedAt && (
                <>
                  <div>
                    <span className="font-bold text-gray-500 block">
                      Ngày duyệt/từ chối:
                    </span>{" "}
                    {new Date(detailRequest.reviewedAt).toLocaleDateString(
                      "vi-VN",
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-gray-500 block">
                      Người xử lý:
                    </span>{" "}
                    {detailRequest.reviewedBy}
                  </div>
                </>
              )}
            </div>

            {detailRequest?.reviewComment && (
              <div
                className={cn(
                  "mt-2 pt-4 border-t",
                  detailRequest.status === "REJECTED"
                    ? "border-red-500/20"
                    : "border-green-500/20",
                )}
              >
                <span
                  className={cn(
                    "font-bold block mb-1",
                    detailRequest.status === "REJECTED"
                      ? "text-red-400"
                      : "text-green-400",
                  )}
                >
                  {detailRequest.status === "REJECTED"
                    ? "Lý do từ chối (Admin Comment):"
                    : "Lời nhắn từ Admin:"}
                </span>
                <p
                  className={cn(
                    "p-3 rounded border",
                    detailRequest.status === "REJECTED"
                      ? "bg-red-500/10 text-red-200 border-red-500/20"
                      : "bg-green-500/10 text-green-200 border-green-500/20",
                  )}
                >
                  {detailRequest.reviewComment}
                </p>
              </div>
            )}
          </div>
        }
        confirmText="Đóng"
        cancelText=""
      />
    </Fragment>
  );
}
