"use client";

import { useAlbumTracksDetail, useDeleteTrack } from "@/hooks/use-tracks";
import { Fragment, useState } from "react";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { TrackDetail } from "@/types";
import { TrackItem } from "./track-item";
import { AlertCircle, Loader2, Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackItemSkeleton } from "./track-item-skeleton";
import { useAlbumDetail } from "@/hooks/use-albums";
import { PageHeading } from "@/components/page-heading";
import Link from "next/link";

interface TrackGridProps {
  albumId: string;
}

export default function TrackGrid({ albumId }: TrackGridProps) {
  const { data: albumRes } = useAlbumDetail(albumId);
  const {
    data: tracksRes,
    isLoading,
    isError,
    refetch,
  } = useAlbumTracksDetail(albumId);

  const tracks = tracksRes?.data || [];
  const album = albumRes?.data;

  const deleteMutation = useDeleteTrack(albumId);
  const [trackToDelete, setTrackToDelete] = useState<any>(null);

  const executeDelete = () => {
    if (!trackToDelete) return;
    deleteMutation.mutate(trackToDelete.id, {
      onSuccess: () => setTrackToDelete(null),
    });
  };

  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <PageHeading>
          Bài hát trong: <span className="text-pink-500">{album?.title}</span>
        </PageHeading>

        <Link href={`/studio/albums/${albumId}/tracks/new`}>
          <Button className="bg-pink-500 hover:bg-pink-600 font-bold shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            <Plus className="w-5 h-5 mr-2" /> Thêm bài hát
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl mt-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background/50 text-muted-foreground text-xs font-bold uppercase tracking-wider border-b border-border/50">
              <th className="py-4 px-4 w-12 text-center">#</th>
              <th className="py-4 px-4">Bài hát</th>
              <th className="py-4 px-4">Thể loại</th>
              <th className="py-4 px-4">Trạng thái</th>
              <th className="py-4 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TrackItemSkeleton key={idx} />
              ))
            ) : isError ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <AlertCircle className="w-10 h-10 text-red-500/50" />
                    <p className="text-red-400 font-medium">
                      Đã có lỗi xảy ra khi tải danh sách bài hát.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => refetch()}
                      className="border-white/10 text-gray-300 hover:text-white"
                    >
                      <RefreshCcw className="w-4 h-4 mr-2" /> Thử lại
                    </Button>
                  </div>
                </td>
              </tr>
            ) : tracks.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-20 text-center text-muted-foreground"
                >
                  Chưa có bài hát nào phù hợp.
                </td>
              </tr>
            ) : (
              tracks.map((track: TrackDetail) => (
                <TrackItem
                  key={track.id}
                  track={track}
                  albumId={albumId}
                  onDelete={setTrackToDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!trackToDelete}
        onClose={() => setTrackToDelete(null)}
        onConfirm={executeDelete}
        title="Xóa bài hát"
        description={
          <>
            Bạn có chắc chắn muốn xóa bài hát{" "}
            <span className="text-white font-bold">
              "{trackToDelete?.title}"
            </span>{" "}
            không? Hành động này sẽ xóa cả file âm thanh và không thể hoàn tác.
          </>
        }
        confirmText="Xác nhận xóa"
        cancelText="Huỷ"
        isProcessing={deleteMutation.isPending}
      />
    </Fragment>
  );
}
