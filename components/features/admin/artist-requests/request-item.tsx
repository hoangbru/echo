"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { ArtistRequestStatus, ArtistRequest } from "@/types";

interface RequestItemProps {
  request: ArtistRequest;
  index: number;
  currentStatus: string;
  onApprove: () => void;
  onRejectClick: () => void;
  onViewDetail: () => void;
  isUpdating: boolean;
}

export function RequestItem({
  request,
  index,
  currentStatus,
  onApprove,
  onRejectClick,
  onViewDetail,
  isUpdating,
}: RequestItemProps) {
  const formatDate = (dateStr: string | null) =>
    dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "N/A";

  const renderCells = () => {
    if (currentStatus === "PENDING") {
      return (
        <>
          <td className="py-4 px-4 align-top">
            <p className="text-foreground font-bold text-base tracking-tight">
              {request.stageName}
            </p>
            <p
              className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed"
              title={request.bio || ""}
            >
              {request.bio || "Chưa cập nhật tiểu sử."}
            </p>
          </td>
          <td className="py-4 px-4 align-top text-sm">
            <div className="flex flex-col gap-1.5 mt-1">
              {(request.socialLinks as any)?.facebook && (
                <a
                  href={(request.socialLinks as any).facebook}
                  target="_blank"
                  className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
                >
                  Facebook
                </a>
              )}
              {(request.socialLinks as any)?.youtube && (
                <a
                  href={(request.socialLinks as any).youtube}
                  target="_blank"
                  className="text-red-500 hover:text-red-400 font-medium transition-colors"
                >
                  YouTube
                </a>
              )}
            </div>
          </td>
          <td className="py-4 px-4 align-top text-sm font-medium text-muted-foreground">
            <span className="mt-1 block">{formatDate(request.createdAt)}</span>
          </td>
        </>
      );
    }

    if (currentStatus === "REJECTED") {
      return (
        <>
          <td className="py-4 px-4 align-top font-bold text-foreground text-base tracking-tight">
            {request.stageName}
          </td>
          <td className="py-4 px-4 align-top">
            <p className="my-1 block text-sm font-medium text-muted-foreground">{request.reviewedBy || "Admin"}</p>
            <p className="text-sm text-destructive line-clamp-2 bg-destructive/10 border border-destructive/20 p-2.5 rounded-md leading-relaxed">
              {request.reviewComment || "Không có lý do"}
            </p>
          </td>
          <td className="py-4 px-4 align-top text-sm font-medium text-muted-foreground">
            <span className="mt-1 block">{formatDate(request.reviewedAt)}</span>
          </td>
        </>
      );
    }

    if (currentStatus === "APPROVED") {
      return (
        <>
          <td className="py-4 px-4 align-top font-bold text-foreground text-base tracking-tight">
            {request.stageName}
          </td>
          <td className="py-4 px-4 align-top text-sm font-medium text-muted-foreground">
            <span className="mt-1 block">{request.reviewedBy || "Admin"}</span>
          </td>
          <td className="py-4 px-4 align-top text-sm font-medium text-muted-foreground">
            <span className="mt-1 block">{formatDate(request.reviewedAt)}</span>
          </td>
        </>
      );
    }

    // Default "ALL" Status
    return (
      <>
        <td className="py-4 px-4 align-top font-bold text-foreground text-base tracking-tight">
          <span className="mt-1 block">{request.stageName}</span>
        </td>
        <td className="py-4 px-4 align-top">
          <Badge
            variant="outline"
            className={cn(
              "font-bold uppercase tracking-wider text-xs mt-1 border",
              request.status === ArtistRequestStatus.PENDING &&
                "text-yellow-500 border-yellow-500/30 bg-yellow-500/10",
              request.status === ArtistRequestStatus.APPROVED &&
                "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
              request.status === ArtistRequestStatus.REJECTED &&
                "text-destructive border-destructive/30 bg-destructive/10",
            )}
          >
            {request.status}
          </Badge>
        </td>
        <td className="py-4 px-4 align-top text-sm font-medium text-muted-foreground">
          <span className="mt-1 block">{formatDate(request.createdAt)}</span>
        </td>
      </>
    );
  };

  return (
    <tr className="group border-b border-border hover:bg-muted/30 transition-all duration-200">
      <td className="py-4 px-4 text-center text-muted-foreground font-semibold text-sm align-top">
        <span className="mt-1 block">{index}</span>
      </td>
      {renderCells()}
      <td className="py-4 px-4 text-right align-top">
        <div className="flex justify-end gap-2 mt-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={onViewDetail}
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" />
          </Button>

          {request.status === ArtistRequestStatus.PENDING && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={onApprove}
                disabled={isUpdating}
                className="h-8 w-8 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 transition-colors"
                title="Phê duyệt"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRejectClick}
                disabled={isUpdating}
                className="h-8 w-8 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white border border-destructive/20 transition-colors"
                title="Từ chối"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
