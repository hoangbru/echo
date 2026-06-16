import { Clock, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TrackListRow, TrackListRowSkeleton } from "@/components/shared";

import { useTracksAlbum } from "@/hooks/use-albums";
import { AlbumDetail, TrackDetail } from "@/types";

export function AlbumTrackList({
  album,
  tracks,
}: {
  album: AlbumDetail;
  tracks: TrackDetail[];
}) {
  const {
    isLoading: isLoadingTracksAlbum,
    isError,
    refetch,
  } = useTracksAlbum(album.id);

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
            <TrackListRowSkeleton key={idx} />
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
          tracks.map((track) => {
            return (
              <TrackListRow
                key={track.id}
                track={track}
                contextTracks={tracks}
                contextId={album.id}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
