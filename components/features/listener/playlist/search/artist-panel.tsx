"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Disc3, User } from "lucide-react";

import { AlbumTrackList } from "./album-track-list";
import { TrackRow } from "./track-row";

import type { AlbumResult, ArtistResult } from "@/types/search";
import type { AlbumDetail } from "@/types";
import { useAlbums } from "@/hooks/use-albums";
import { useTracks } from "@/hooks/use-tracks";

function ArtistAvatar({ artist }: { artist: ArtistResult }) {
  return (
    <div className="relative w-10 h-10 flex-shrink-0 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden">
      {artist.profileImage ? (
        <Image
          src={artist.profileImage}
          alt={artist.stageName}
          fill
          sizes="40px"
          className="object-cover"
        />
      ) : (
        <User className="w-4 h-4 text-muted-foreground" />
      )}
    </div>
  );
}

function AlbumCover({ album }: { album: AlbumResult }) {
  return (
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
  );
}

type ArtistDetailProps = {
  artist: ArtistResult;
  playlistId: string;
  existingTrackIds: Set<string>;
  onBack: () => void;
};

function ArtistDetail({
  artist,
  playlistId,
  existingTrackIds,
  onBack,
}: ArtistDetailProps) {
  const [subTab, setSubTab] = useState<"songs" | "albums">("songs");
  const [drillAlbum, setDrillAlbum] = useState<AlbumResult | null>(null);

  const { data: tracksData, isLoading: isLoadingTracks } = useTracks({
    artistId: artist.id,
  });

  const { data: albumsData, isLoading: isLoadingAlbums } = useAlbums({
    artistId: artist.id,
  });

  const tracks = tracksData?.data ?? [];

  const rawAlbums: AlbumDetail[] = albumsData?.data ?? [];
  const albums: AlbumResult[] = rawAlbums.map((al) => ({
    id: al.id,
    title: al.title,
    coverImage: al.coverImage,
    albumType: al.albumType ?? "ALBUM",
    isExplicit: !!al.isExplicit,
    artist: al.artist
      ? { id: al.artist.id, stageName: al.artist.stageName }
      : null,
  }));

  if (drillAlbum) {
    return (
      <AlbumTrackList
        album={drillAlbum}
        playlistId={playlistId}
        existingTrackIds={existingTrackIds}
        onBack={() => setDrillAlbum(null)}
        backLabel={artist.stageName}
      />
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Kết quả
      </button>

      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
        <ArtistAvatar artist={artist} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {artist.stageName}
          </p>
          <p className="text-xs text-muted-foreground">Nghệ sĩ</p>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        {(["songs", "albums"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`px-3 py-1 rounded-full text-xs border transition-colors
              ${
                subTab === tab
                  ? "bg-foreground text-background border-transparent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
          >
            {tab === "songs"
              ? `Bài hát${tracks.length ? ` (${tracks.length})` : ""}`
              : `Album${albums.length ? ` (${albums.length})` : ""}`}
          </button>
        ))}
      </div>

      {subTab === "songs" && (
        <div className="flex flex-col gap-0.5">
          {isLoadingTracks && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Đang tải...
            </p>
          )}
          {!isLoadingTracks && tracks.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Không tìm thấy bài hát.
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
      )}

      {subTab === "albums" && (
        <div className="flex flex-col gap-0.5">
          {isLoadingAlbums && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Đang tải...
            </p>
          )}
          {!isLoadingAlbums && albums.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Không tìm thấy album.
            </p>
          )}
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => setDrillAlbum(album)}
              className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary/60 transition-colors w-full text-left"
            >
              <AlbumCover album={album} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {album.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {album.albumType}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type Props = {
  artists: ArtistResult[];
  playlistId: string;
  existingTrackIds: Set<string>;
};

export function ArtistPanel({ artists, playlistId, existingTrackIds }: Props) {
  const [selected, setSelected] = useState<ArtistResult | null>(null);

  if (selected) {
    return (
      <ArtistDetail
        artist={selected}
        playlistId={playlistId}
        existingTrackIds={existingTrackIds}
        onBack={() => setSelected(null)}
      />
    );
  }

  if (artists.length === 0)
    return (
      <p className="text-sm text-muted-foreground py-6 text-center">
        Không tìm thấy nghệ sĩ nào.
      </p>
    );

  return (
    <div className="flex flex-col gap-0.5">
      {artists.map((artist) => (
        <button
          key={artist.id}
          onClick={() => setSelected(artist)}
          className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary/60 transition-colors w-full text-left"
        >
          <ArtistAvatar artist={artist} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {artist.stageName}
            </p>
            <p className="text-xs text-muted-foreground">Nghệ sĩ</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </button>
      ))}
    </div>
  );
}
