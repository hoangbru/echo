import { Clock, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AlbumTrackRow } from "./album-track-row";
import { TrackRowSkeleton } from "./album-skeleton";

import { usePlayer, PlayerTrack } from "@/hooks/use-player";
import { useTracksAlbum } from "@/hooks/use-albums";
import { AlbumDetail, TrackDetail } from "@/types";

export function AlbumTrackList({
  album,
  tracks,
}: {
  album: AlbumDetail;
  tracks: TrackDetail[];
}) {
  const { playTrack, togglePlay, currentTrack, isPlaying } = usePlayer();
  const {
    isLoading: isLoadingTracksAlbum,
    isError,
    refetch,
  } = useTracksAlbum(album.id);

  const handlePlaySingleTrack = (track: TrackDetail, index: number) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    const queue: PlayerTrack[] = tracks.map((t) => ({
      id: t.id,
      title: t.title,
      lyrics: t.lyrics || "",
      artistNames:
        t.artists?.map((ta: any) => ta.stageName).join(", ") ||
        album.artist?.stageName ||
        "Unknown Artist",
      imageUrl: t.imageUrl || album.coverImage || "/default-cover.jpg",
      audioUrl: t.audioUrl,
      albumId: album.id,
    }));

    playTrack(queue[index], queue);
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-[50px_minmax(0,1fr)_100px] md:grid-cols-[50px_minmax(0,2fr)_minmax(0,1fr)_100px] gap-4 px-4 py-2 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
        <div className="text-center">#</div>
        <div>Tiêu đề</div>
        <div className="hidden md:block">Lượt nghe</div>
        <div className="flex justify-center">
          <Clock className="w-4 h-4" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {isLoadingTracksAlbum ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <TrackRowSkeleton key={idx} />
          ))
        ) : isError ? (
          <div className="py-20 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-red-400 font-medium">
                Đã có lỗi xảy ra khi tải danh sách bài hát.
              </p>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="border-border text-muted-foreground hover:text-foreground"
              >
                <RefreshCcw className="w-4 h-4 mr-2" /> Thử lại
              </Button>
            </div>
          </div>
        ) : tracks.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            Chưa có bài hát nào phù hợp.
          </div>
        ) : (
          tracks.map((track, index) => {
            const isThisTrackPlaying = currentTrack?.id === track.id;
            const isActuallyPlaying = isThisTrackPlaying && isPlaying;

            return (
              <AlbumTrackRow
                key={track.id}
                track={track}
                index={index}
                album={album}
                isThisTrackPlaying={isThisTrackPlaying}
                isActuallyPlaying={isActuallyPlaying}
                onPlaySingleTrack={handlePlaySingleTrack}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
