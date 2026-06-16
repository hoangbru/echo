"use client";

import { useState } from "react";
import { TrackListRow, TrackListRowSkeleton } from "@/components/shared";

import { useTracks } from "@/hooks/use-tracks";

interface PopularTracksProps {
  artistId: string;
}

export function PopularTracks({ artistId }: PopularTracksProps) {
  const [showAll, setShowAll] = useState(false);

  const { data: trackData, isLoading: isLoadingPopularTracks } = useTracks({
    artistId: artistId,
    sortBy: "total_streams",
    sortDir: "desc",
  });

  const popularTracks = trackData?.data || [];

  const visibleTracks = showAll ? popularTracks : popularTracks.slice(0, 5);

  return (
    <section className="px-8">
      <h2 className="text-[24px] font-semibold mb-4 text-foreground">
        Phổ biến
      </h2>
      <div className="flex flex-col">
        {isLoadingPopularTracks ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TrackListRowSkeleton key={`track-skeleton-${index}`} />
          ))
        ) : popularTracks.length === 0 ? (
          <p className="text-muted-foreground text-[14px] px-4 py-2">
            Nghệ sĩ này chưa có bài hát nào phổ biến.
          </p>
        ) : (
          <>
            {visibleTracks.map((track) => (
              <TrackListRow
                key={track.id}
                track={track}
                contextTracks={visibleTracks}
                contextId={`artist-${artistId}-popular-tracks`}
              />
            ))}

            {popularTracks.length > 5 && (
              <div className="mt-4 px-4">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {showAll ? "Ẩn bớt" : "Xem thêm"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
