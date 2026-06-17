import Image from "next/image";
import { ChevronLeft, Disc3 } from "lucide-react";
import { useTracksAlbum } from "@/hooks/use-albums";
import { TrackRow } from "./track-row";
import type { AlbumResult } from "@/types/search";

type Props = {
  album: AlbumResult;
  playlistId: string;
  existingTrackIds: Set<string>;
  onBack: () => void;
  backLabel: string;
};

export function AlbumTrackList({
  album,
  playlistId,
  existingTrackIds,
  onBack,
  backLabel,
}: Props) {
  const { data, isLoading } = useTracksAlbum(album.id);
  const tracks = data?.data ?? [];

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        {backLabel}
      </button>

      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
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
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {album.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {album.artist?.stageName ?? "—"}
          </p>
        </div>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Đang tải...
        </p>
      )}
      {!isLoading && tracks.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Album này chưa có bài hát nào.
        </p>
      )}
      {tracks.map((track) => (
        <TrackRow
          key={track.id}
          track={track}
          playlistId={playlistId}
          existingTrackIds={existingTrackIds}
        />
      ))}
    </div>
  );
}
