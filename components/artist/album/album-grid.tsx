"use client";

import { Fragment, useState } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

import { AlbumCard } from "./album-card";
import { AlbumCardSkeleton } from "./album-card-skeleton";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { AlbumToolbar } from "./album-toolbar";
import { useAlbums, useDeleteAlbum } from "@/hooks/use-albums";

interface AlbumGridProps {
  search: string;
  status: string;
  genre: string;
  page: number;
}

export default function AlbumGrid({
  search,
  status,
  genre,
  page,
}: AlbumGridProps) {
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useAlbums({ search, status, genre, page, view: "studio" });
  const deleteMutation = useDeleteAlbum();

  const albums = response?.data || [];
  const [albumToDelete, setAlbumToDelete] = useState<any>(null);

  const executeDelete = () => {
    if (!albumToDelete) return;
    deleteMutation.mutate(albumToDelete.id, {
      onSuccess: () => setAlbumToDelete(null),
    });
  };

  return (
    <Fragment>
      <AlbumToolbar
        currentSearch={search}
        currentStatus={status}
        currentGenre={genre}
      />

      <div
        className={`transition-opacity duration-200 ${
          deleteMutation.isPending ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
            {Array.from({ length: 10 }).map((_, idx) => (
              <AlbumCardSkeleton key={idx} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-red-500/20 mt-8 gap-4">
            <AlertCircle className="w-10 h-10 text-red-500/50" />
            <p className="text-red-400 font-medium">
              Đã có lỗi xảy ra khi tải danh sách Album.
            </p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="border-white/10 text-gray-300 hover:text-white"
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Thử lại
            </Button>
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-white/5 mt-8">
            <p className="text-gray-500">
              Bạn chưa có Album nào. Hãy tạo mới ngay!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
            {albums.map((album: any) => (
              <AlbumCard
                key={album.id}
                album={album}
                onDelete={setAlbumToDelete}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!albumToDelete}
        onClose={() => setAlbumToDelete(null)}
        onConfirm={executeDelete}
        title="Xóa Album này?"
        description={
          <>
            Bạn có chắc muốn xóa Album{" "}
            <span className="text-white font-bold">
              "{albumToDelete?.title}"
            </span>{" "}
            không? Hành động này sẽ xóa vĩnh viễn toàn bộ bài hát bên trong.
          </>
        }
        confirmText="Xác nhận xóa"
        cancelText="Huỷ"
        isProcessing={deleteMutation.isPending}
      />
    </Fragment>
  );
}
