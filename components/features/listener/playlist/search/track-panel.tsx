import { TrackRow } from "./track-row";

import type { TrackResult } from "@/types/search";

type Props = {
  tracks: TrackResult[];
  playlistId: string;
  existingTrackIds: Set<string>;
};

export function TrackPanel({ tracks, playlistId, existingTrackIds }: Props) {
  if (tracks.length === 0)
    return (
      <p className="text-sm text-muted-foreground py-6 text-center">
        Không tìm thấy bài hát nào.
      </p>
    );

  return (
    <div className="flex flex-col gap-0.5">
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
