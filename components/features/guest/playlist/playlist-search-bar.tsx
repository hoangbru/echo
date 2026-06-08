"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";

import { TrackPanel } from "./search/track-panel";
import { AlbumPanel } from "./search/album-panel";
import { ArtistPanel } from "./search/artist-panel";

import { useDebounce } from "@/hooks/use-debounce";
import { useSearch } from "@/hooks/use-search";
import { Tab } from "@/types/playlist.type";
import { TABS } from "@/constants/search";

type Props = {
  playlistId: string;
  existingTrackIds?: string[];
};

export const PlaylistSearchBar = ({
  playlistId,
  existingTrackIds = [],
}: Props) => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("track");

  const debouncedQuery = useDebounce(query, 350);
  const existingSet = useMemo(
    () => new Set(existingTrackIds),
    [existingTrackIds],
  );

  const { data, isFetching } = useSearch(debouncedQuery, {
    types: ["track", "album", "artist"],
    enabled: debouncedQuery.trim().length > 0,
  });

  const tracks = data?.data?.tracks ?? [];
  const albums = data?.data?.albums ?? [];
  const artists = data?.data?.artists ?? [];

  const counts: Record<Tab, number> = {
    track: tracks.length,
    album: albums.length,
    artist: artists.length,
  };

  const showResults = debouncedQuery.trim().length > 0;

  return (
    <div className="mt-4 pt-8 border-t border-border">
      <h3 className="text-xl font-bold text-foreground mb-4">
        Hãy cùng tìm nội dung cho danh sách phát của bạn
      </h3>

      <div className="relative max-w-md group mb-4">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm bài hát, album hoặc nghệ sĩ"
          className="w-full h-12 rounded-md bg-secondary hover:bg-secondary/80 border border-transparent pl-12 pr-12 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:border-border focus:ring-1 focus:ring-ring/30 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="max-w-md">
          <div className="flex gap-2 mb-3">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors
                  ${
                    activeTab === key
                      ? "bg-foreground text-background border-transparent"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
              >
                {label}
                {counts[key] > 0 && (
                  <span className="ml-1 opacity-60">({counts[key]})</span>
                )}
              </button>
            ))}
          </div>

          {isFetching && (
            <p className="text-xs text-muted-foreground py-2">
              Đang tìm kiếm...
            </p>
          )}

          {!isFetching && (
            <>
              {activeTab === "track" && (
                <TrackPanel
                  tracks={tracks}
                  playlistId={playlistId}
                  existingTrackIds={existingSet}
                />
              )}
              {activeTab === "album" && (
                <AlbumPanel
                  albums={albums}
                  playlistId={playlistId}
                  existingTrackIds={existingSet}
                />
              )}
              {activeTab === "artist" && (
                <ArtistPanel
                  artists={artists}
                  playlistId={playlistId}
                  existingTrackIds={existingSet}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
