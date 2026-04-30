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
            <p className="text-white font-bold">{request.stageName}</p>
            <p
              className="text-sm text-gray-500 line-clamp-2 mt-1"
              title={request.bio || ""}
            >
              {request.bio}
            </p>
          </td>
          <td className="py-4 px-4 align-top text-sm">
            <div className="flex flex-col gap-1">
              {(request.socialLinks as any)?.facebook && (
                <a
                  href={(request.socialLinks as any).facebook}
                  target="_blank"
                  className="text-blue-400 hover:underline"
                >
                  Facebook
                </a>
              )}
              {(request.socialLinks as any)?.youtube && (
                <a
                  href={(request.socialLinks as any).youtube}
                  target="_blank"
                  className="text-red-400 hover:underline"
                >
                  YouTube
                </a>
              )}
            </div>
          </td>
          <td className="py-4 px-4 align-top text-sm text-gray-400">
            {formatDate(request.createdAt)}
          </td>
        </>
      );
    }

    if (currentStatus === "REJECTED") {
      return (
        <>
          <td className="py-4 px-4 align-top font-bold text-white">
            {request.stageName}
          </td>
          <td className="py-4 px-4 align-top">
            <p className="text-sm text-red-400 line-clamp-2 bg-red-500/10 p-2 rounded">
              {request.reviewComment || "Không có lý do"}
            </p>
          </td>
          <td className="py-4 px-4 align-top text-sm text-gray-400">
            {formatDate(request.reviewedAt)}
          </td>
        </>
      );
    }

    if (currentStatus === "APPROVED") {
      return (
        <>
          <td className="py-4 px-4 align-top font-bold text-white">
            {request.stageName}
          </td>
          <td className="py-4 px-4 align-top text-sm text-gray-300">
            {request.reviewedBy || "Admin"}
          </td>
          <td className="py-4 px-4 align-top text-sm text-gray-400">
            {formatDate(request.reviewedAt)}
          </td>
        </>
      );
    }

    return (
      <>
        <td className="py-4 px-4 align-top font-bold text-white">
          {request.stageName}
        </td>
        <td className="py-4 px-4 align-top">
          <Badge
            variant="outline"
            className={cn(
              "font-bold uppercase",
              request.status === ArtistRequestStatus.PENDING &&
                "text-yellow-500 border-yellow-500/50",
              request.status === ArtistRequestStatus.APPROVED &&
                "text-green-500 border-green-500/50",
              request.status === ArtistRequestStatus.REJECTED &&
                "text-red-500 border-red-500/50",
            )}
          >
            {request.status}
          </Badge>
        </td>
        <td className="py-4 px-4 align-top text-sm text-gray-400">
          {formatDate(request.createdAt)}
        </td>
      </>
    );
  };

  return (
    <tr className="group border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="py-4 px-4 text-center text-gray-500 font-bold text-sm align-top">
        {index}
      </td>
      {renderCells()}
      <td className="py-4 px-4 text-right align-top">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onViewDetail}
            className="h-8 w-8 text-gray-400 hover:text-white"
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
                className="h-8 w-8 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-600/50"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRejectClick}
                disabled={isUpdating}
                className="h-8 w-8 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/50"
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
