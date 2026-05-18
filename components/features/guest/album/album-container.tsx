"use client";

import Link from "next/link";
import { Heart, MoreHorizontal, Pause, Play } from "lucide-react";

import { AlbumTrackList } from "./album-track-list";
import { AlbumHeroSection } from "./album-hero-section";
import { AlbumCard } from "@/components/shared/cards";
import { AlbumPageSkeleton } from "./album-skeleton";

import { useAlbumDetail, useTracksAlbum } from "@/hooks/use-albums";
import { useAlbumsArtist } from "@/hooks/use-artists";
import { formatDate } from "@/lib/utils/format";
import { PlayerTrack, usePlayer } from "@/hooks/use-player";

interface AlbumContainerProps {
  albumId: string;
}

const AlbumContainer = ({ albumId }: AlbumContainerProps) => {
  const { data: albumRes, isLoading: isLoadingAlbumDetail } =
    useAlbumDetail(albumId);
  const { data: tracksRes } = useTracksAlbum(albumId);

  const tracks = tracksRes?.data || [];
  const album = albumRes?.data || null;

  const { data: otherAlbumsRes } = useAlbumsArtist(
    album ? album.artist.id : "",
    albumId,
  );
  const otherAlbums = otherAlbumsRes?.data || [];
  const { playTrack, togglePlay, activeContextId, isPlaying } = usePlayer();

  const isThisAlbumPlaying = activeContextId === albumId && isPlaying;

  const handlePlayAlbum = () => {
    if (tracks.length === 0) return;

    if (isThisAlbumPlaying) {
      togglePlay();
      return;
    }

    const queue: PlayerTrack[] = tracks.map((t) => ({
      id: t.id,
      title: t.title,
      lyrics: t.lyrics || "",
      artistNames:
        t.artists?.map((ta: any) => ta.stageName).join(", ") ||
        album?.artist?.stageName ||
        "Unknown Artist",
      imageUrl: t.imageUrl || album?.coverImage || "/default-cover.jpg",
      audioUrl: t.audioUrl,
      albumId: albumId,
    }));

    playTrack(queue[0], queue, album?.id);
  };

  const totalDurationSeconds = tracks.reduce(
    (acc: number, t: any) => acc + (t.duration || 0),
    0,
  );
  const totalMins = Math.floor(totalDurationSeconds / 60);

  if (isLoadingAlbumDetail) {
    return <AlbumPageSkeleton />;
  }

  return (
    <div>
      {/* --- HERO SECTION --- */}
      {album && <AlbumHeroSection album={album} totalMins={totalMins} />}

      {/* --- CONTENT SECTION --- */}
      <div className="px-6 bg-gradient-to-b from-neutral-900/50 to-[#121212] min-h-screen pt-4">
        <div className="pb-8">
          {/* --- ACTION BAR --- */}
          <div className="flex items-center gap-6 py-6">
            <button
              onClick={handlePlayAlbum}
              className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
            >
              {isThisAlbumPlaying ? (
                <Pause className="w-6 h-6 text-black fill-black" />
              ) : (
                <Play className="w-6 h-6 text-black fill-black ml-1" />
              )}
            </button>

            <button className="text-gray-400 hover:text-white transition-colors">
              <Heart className="w-8 h-8" />
            </button>

            <button className="text-gray-400 hover:text-white transition-colors">
              <MoreHorizontal className="w-8 h-8" />
            </button>
          </div>

          {album && <AlbumTrackList album={album} tracks={tracks} />}
        </div>
        {/* Copyright Information */}
        <div className="mt-8 mb-12 flex flex-col gap-1 text-[13px] text-gray-400 font-medium">
          <p>{formatDate(album?.releaseDate || "", "full")}</p>
          <p>
            © {formatDate(album?.releaseDate || "", "yearOnly")}{" "}
            {album?.artist?.stageName}
          </p>
          {album?.recordLabel && (
            <p>
              ℗ {formatDate(album?.releaseDate || "", "yearOnly")}{" "}
              {album?.recordLabel || ""}
            </p>
          )}
        </div>

        {/* Other Albums */}
        {otherAlbums.length > 0 && (
          <div className="mt-12 pb-32">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">
                Nhiều hơn từ {album?.artist.stageName}
              </h2>
              <Link
                href={`/artist/${album?.artist.id}`}
                className="text-sm font-bold text-gray-400 hover:text-white hover:underline uppercase tracking-wider"
              >
                Xem trang nghệ sĩ
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {otherAlbums.map((otherAlbum: any) => (
                <AlbumCard key={otherAlbum.id} album={otherAlbum} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumContainer;
