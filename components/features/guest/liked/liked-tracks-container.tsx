"use client";

import { useMemo } from "react";
import { Download, Pause, Play, Shuffle } from "lucide-react";

import { LikedTrackHero } from "./liked-tracks-hero";
import { LikedTracksList } from "./liked-tracks-list";
import { LikedTracksPageSkeleton } from "./liked-tracks-skeleton";

import { PlayerTrack, usePlayer } from "@/hooks/use-player";
import { useLikedTracks } from "@/hooks/use-tracks";

const LikedTracksContainer = () => {
  const { activeContextId, playTrack, togglePlay, isPlaying } = usePlayer();
  const { data, isLoading: isLoadingLikedTracks } = useLikedTracks({
    limit: 15,
  });

  const tracks = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const isThisPlaylistPlaying = activeContextId === "liked_songs" && isPlaying;

  const handlePlayPlaylist = () => {
    if (tracks.length === 0) return;

    if (activeContextId === "liked_songs") {
      togglePlay();
      return;
    }

    const queue: PlayerTrack[] = tracks.map((t) => ({
      id: t.id,
      title: t.title,
      lyrics: t.lyrics || "",
      artistNames:
        t.artists?.map((ta: any) => ta.stageName).join(", ") ||
        "Unknown Artist",
      imageUrl: t.imageUrl || "/default-cover.jpg",
      audioUrl: t.audioUrl,
      albumId: t.albumId || "",
    }));

    playTrack(queue[0], queue, "liked_songs");
  };

  const totalDurationSeconds = tracks.reduce(
    (acc: number, t: any) => acc + (t.duration || 0),
    0,
  );

  const totalMins = Math.floor(totalDurationSeconds / 60);

  if (isLoadingLikedTracks) {
    return <LikedTracksPageSkeleton />;
  }

  return (
    <div className="bg-background min-h-screen">
      {/* --- HERO SECTION --- */}
      {tracks && (
        <LikedTrackHero totalTracks={tracks.length} totalMins={totalMins} />
      )}

      {/* --- CONTENT SECTION --- */}
      <div className="px-6 bg-gradient-to-b from-secondary/50 to-background min-h-screen pt-4">
        <div className="pb-8">
          {/* --- ACTION BAR --- */}
          <div className="flex items-center gap-6 py-6">
            <button
              onClick={handlePlayPlaylist}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                tracks.length > 0
                  ? "bg-primary hover:scale-105 shadow-primary/30 cursor-pointer"
                  : "bg-primary/50 cursor-not-allowed opacity-50"
              }`}
              disabled={tracks.length === 0}
            >
              {isThisPlaylistPlaying ? (
                <Pause className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
              ) : (
                <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-1" />
              )}
            </button>

            <button className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all">
              <Download className="w-8 h-8" />
            </button>
          </div>

          {tracks && <LikedTracksList tracks={tracks} />}
        </div>
      </div>
    </div>
  );
};

export default LikedTracksContainer;
