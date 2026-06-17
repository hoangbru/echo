"use client";

import { ArtistHeader, ArtistHeaderSkeleton } from "./artist-header";
import { ActionButtons, ActionButtonsSkeleton } from "./artist-action-button";
import { PopularTracks } from "./artist-popular-tracks";
import { Discography } from "./artist-discography";

import { useArtistDetail } from "@/hooks/use-artists";
import { useTracks } from "@/hooks/use-tracks";
import { usePlayer, PlayerTrack } from "@/hooks/use-player";
import { TrackDetail } from "@/types";

interface ArtistDetailContainerProps {
  artistId: string;
}

export const ArtistDetailContainer = ({
  artistId,
}: ArtistDetailContainerProps) => {
  const { data: artist, isLoading: isLoadingArtistDetail } =
    useArtistDetail(artistId);
  const { playTrack } = usePlayer();

  const { data: trackData } = useTracks({
    artistId: artistId,
    sortBy: "total_streams",
    sortDir: "desc",
  });

  const isLoading = isLoadingArtistDetail;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-24">
        <ArtistHeaderSkeleton />
        <ActionButtonsSkeleton />
        <div className="flex flex-col gap-10">
          <PopularTracks artistId={artistId} />
          <Discography artistId={artistId} />
        </div>
      </div>
    );
  }

  if (!artist) return null;

  const handlePlayPopularTracks = () => {
    const popularTracks = trackData?.data || [];
    if (popularTracks.length === 0) return;

    const queue: PlayerTrack[] = popularTracks.map((t: TrackDetail) => ({
      id: t.id,
      title: t.title,
      lyrics: t.lyrics || undefined,
      artistNames:
        t.artists?.map((ta: any) => ta.stageName).join(", ") ||
        artist.stageName ||
        "Unknown Artist",
      imageUrl: t.imageUrl || t.album?.coverImage || "/default-cover.jpg",
      audioUrl: t.audioUrl,
      albumId: t.album?.id || t.albumId || "",
    }));

    playTrack(queue[0], queue, `artist-${artistId}-popular`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <ArtistHeader artist={artist} />

      <ActionButtons
        artistId={artistId}
        onPlayClick={handlePlayPopularTracks}
      />

      <div className="flex flex-col gap-10">
        <PopularTracks artistId={artistId} />
        <Discography artistId={artistId} />
      </div>
    </div>
  );
};
