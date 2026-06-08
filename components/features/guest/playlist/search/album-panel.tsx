"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronRight, Disc3 } from "lucide-react";
import { AlbumTrackList } from "./album-track-list";
import type { AlbumResult } from "@/types/search";

type Props = {
  albums: AlbumResult[];
  playlistId: string;
  existingTrackIds: Set<string>;
};

export function AlbumPanel({ albums, playlistId, existingTrackIds }: Props) {
  const [drillAlbum, setDrillAlbum] = useState<AlbumResult | null>(null);

  if (drillAlbum) {
    return (
      <AlbumTrackList
        album={drillAlbum}
        playlistId={playlistId}
        existingTrackIds={existingTrackIds}
        onBack={() => setDrillAlbum(null)}
        backLabel="Kết quả"
      />
    );
  }

  if (albums.length === 0)
    return (
      <p className="text-sm text-muted-foreground py-6 text-center">
        Không tìm thấy album nào.
      </p>
    );

  return (
    <div className="flex flex-col gap-0.5">
      {albums.map((album) => (
        <button
          key={album.id}
          onClick={() => setDrillAlbum(album)}
          className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary/60 transition-colors w-full text-left"
        >
          <div className="relative w-10 h-10 flex-shrink-0 rounded bg-secondary border border-border flex items-center justify-center overflow-hidden">
            {album.coverImage ? (
              <Image
                src={album.coverImage}
                alt={album.title}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <Disc3 className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {album.title}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {album.albumType} · {album.artist?.stageName ?? "—"}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </button>
      ))}
    </div>
  );
}
