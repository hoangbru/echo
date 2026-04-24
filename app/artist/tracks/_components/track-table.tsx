"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { TrackItem } from "./track-item";
import TrackToolbar from "./track-toolbar";
import DataPagination from "@/components/data-pagination";
import { ConfirmModal } from "@/components/modals/confirm-modal";

import { ITEMS_PER_PAGE } from "@/constants/pagination";
import { createClient } from "@/lib/supabase/client";
import { Track } from "@/types";
import { TrackService } from "@/lib/services";
import { useQueryString } from "@/hooks/use-query-string";

interface TrackTableProps {
  initialTracks: Track[];
  totalCount: number;
  currentPage: number;
  currentSearch: string;
  currentStatus: string;
}

export default function TrackTable({
  initialTracks,
  totalCount,
  currentPage,
  currentSearch,
  currentStatus,
}: TrackTableProps) {
  const router = useRouter();
  const supabase = createClient();

  const { updateURL, isPending, startTransition } = useQueryString();
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [trackToDelete, setTrackToDelete] = useState<Track | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    setTracks(initialTracks);
  }, [initialTracks]);

  const handleDeleteClick = (track: Track) => {
    setTrackToDelete(track);
  };

  const executeDelete = async () => {
    if (!trackToDelete) return;

    setIsDeleting(true);
    try {
      const success = await TrackService.removeTrack(
        supabase,
        trackToDelete.id,
      );

      if (success) {
        toast.success(`Đã xóa bài hát "${trackToDelete.title}"`, {
          position: "top-right",
          className: "bg-card text-white border-white/10",
        });

        setTrackToDelete(null);
        setTracks((prev) => prev.filter((t) => t.id !== trackToDelete.id));
        startTransition(() => {
          router.refresh();
        });
      } else {
        toast.error("Có lỗi xảy ra khi xóa bài hát.", {
          position: "top-right",
        });
      }
    } catch (error: any) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Không thể xóa: " + error.message, { position: "top-right" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Fragment>
      <TrackToolbar
        currentSearch={currentSearch}
        currentStatus={currentStatus}
      />

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background/50 text-muted-foreground text-xs font-bold uppercase tracking-wider">
              <th className="py-4 px-4">Bài hát</th>
              <th className="py-4 px-4">Thể loại</th>
              <th className="py-4 px-4">Ngày phát hành</th>
              <th className="py-4 px-4">Trạng thái</th>
              <th className="py-4 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isPending ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                </td>
              </tr>
            ) : tracks.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-20 text-center text-muted-foreground"
                >
                  Không tìm thấy bài hát nào.
                </td>
              </tr>
            ) : (
              tracks.map((track) => (
                <TrackItem
                  key={track.id}
                  track={track}
                  onEdit={(t) => router.push(`/artist/tracks/edit/${t.id}`)}
                  onDelete={handleDeleteClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        currentCount={tracks.length}
        totalCount={totalCount}
        itemName="bài hát"
        onPageChange={(page) => updateURL("page", page.toString())}
      />

      <ConfirmModal
        isOpen={!!trackToDelete}
        onClose={() => setTrackToDelete(null)}
        onConfirm={executeDelete}
        isProcessing={isDeleting}
        title="Xóa bài hát này?"
        confirmText="Xác nhận xóa"
        description={
          <>
            Bạn có chắc muốn xóa bài hát{" "}
            <span className="text-white font-bold">
              &quot;{trackToDelete?.title}&quot;
            </span>
            ? Hành động này sẽ xóa vĩnh viễn file âm thanh và ảnh bìa khỏi hệ
            thống, không thể khôi phục.
          </>
        }
      />
    </Fragment>
  );
}
