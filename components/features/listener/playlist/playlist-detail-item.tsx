"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Music, Globe, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/shared/modals";

import { usePlaylistDetail, useDeletePlaylist } from "@/hooks/use-playlists";

interface PlaylistDetailItemProps {
  playlistId: string;
}

export const PlaylistDetailItem = ({ playlistId }: PlaylistDetailItemProps) => {
  const { data: playlist } = usePlaylistDetail(playlistId);
  const { mutate: deletePlaylist, isPending: isDeleting } = useDeletePlaylist();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!playlist) return null;

  const handleConfirmDelete = () => {
    deletePlaylist(playlistId, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
      },
    });
  };

  return (
    <Fragment>
      <Link href={`/library/playlists/${playlist.id}`} className="block group">
        <div className="bg-card border border-border/50 rounded-2xl p-4 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
          <div className="relative flex justify-center items-center aspect-square overflow-hidden mb-4 shadow-md bg-card rounded-md group">
            {playlist.coverImage ? (
              <Image
                src={playlist.coverImage}
                alt={playlist.title || "Playlist Cover"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            ) : (
              <Music className="w-16 h-16 text-muted-foreground/50" />
            )}

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10">
              <Button
                size="icon"
                variant="destructive"
                className="rounded-full h-12 w-12 hover:scale-110 transition-transform shadow-lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDeleteModalOpen(true);
                }}
                title="Xóa danh sách phát"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <h3 className="text-foreground font-bold truncate group-hover:text-primary transition-colors">
                {playlist.title}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <Music className="w-3 h-3 text-primary" />
                <p className="text-xs text-muted-foreground">
                  Bởi <span>{playlist.user.username}</span>
                </p>
              </div>
            </div>

            {playlist.isPublic ? (
              <Globe className="w-4 h-4 text-green-500 shrink-0" />
            ) : (
              <Lock className="w-4 h-4 text-yellow-500 shrink-0" />
            )}
          </div>
        </div>
      </Link>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa Danh sách phát?"
        description={
          <>
            Danh sách phát{" "}
            <span className="text-foreground font-bold">{playlist.title}</span>{" "}
            sẽ bị xóa vĩnh viễn. Bạn không thể hoàn tác hành động này.
          </>
        }
        confirmText="Xóa vĩnh viễn"
        cancelText="Hủy"
        isProcessing={isDeleting}
      />
    </Fragment>
  );
};
