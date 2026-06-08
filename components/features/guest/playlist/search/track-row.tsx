import Image from "next/image";
import { Plus, Check, Music } from "lucide-react";

import { useAddTrackToPlaylist } from "@/hooks/use-playlists";

type RowTrack = {
  id: string;
  title: string;
  audioUrl: string;
  imageUrl?: string | null;
  duration?: number | null;
  artists?: { stageName?: string | null; profileImage?: string | null }[];
  album?: {
    id?: string;
    title?: string | null;
    coverImage?: string | null;
  } | null;
};

type Props = {
  track: RowTrack;
  playlistId: string;
  existingTrackIds: Set<string>;
};

export function TrackRow({ track, playlistId, existingTrackIds }: Props) {
  const { mutate: addTrack, isPending } = useAddTrackToPlaylist(playlistId);
  const alreadyAdded = existingTrackIds.has(track.id);

  const displayImage = track.imageUrl ?? track.album?.coverImage ?? null;

  const artistNames =
    track.artists
      ?.filter((a) => a.stageName)
      .map((a) => a.stageName)
      .join(", ") || "Unknown Artist";

  const albumName = track.album?.title ?? null;

  const duration = track.duration
    ? `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, "0")}`
    : "";

  return (
    <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary/60 transition-colors">
      {/* Thumbnail */}
      <div className="relative w-10 h-10 flex-shrink-0 rounded bg-secondary border border-border flex items-center justify-center overflow-hidden">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={track.title}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <Music className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {track.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {artistNames}
          {albumName && <> · {albumName}</>}
          {duration && <> · {duration}</>}
        </p>
      </div>

      {/* Add button */}
      <button
        disabled={alreadyAdded || isPending}
        onClick={() => addTrack(track.id)}
        aria-label={alreadyAdded ? "Đã thêm" : "Thêm vào playlist"}
        className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors
          ${
            alreadyAdded
              ? "bg-green-500/10 border-green-500/30 text-green-600 cursor-default"
              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
          }`}
      >
        {alreadyAdded ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Plus className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
