"use client";

import { useState } from "react";
import { useAlbums } from "@/hooks/use-albums";
import { AlbumType } from "@/types";
import { AlbumCard, AlbumCardSkeleton } from "@/components/shared/cards";

interface DiscographyProps {
  artistId: string;
}

type TabFilter = "all" | AlbumType;

export function Discography({ artistId }: DiscographyProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  const { data: albumData, isLoading: isLoadingDiscography } = useAlbums({
    artistId: artistId,
    sortBy: activeTab === "all" ? "total_streams" : "release_date",
    sortDir: "desc",
    type: activeTab,
  });

  const discography = albumData?.data || [];

  return (
    <section className="px-8 mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px] font-semibold text-foreground">
          Tuyển tập đĩa nhạc
        </h2>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-1.5 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors ${
            activeTab === "all"
              ? "bg-foreground text-background"
              : "bg-sidebar text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          Tất cả
        </button>

        <button
          onClick={() => setActiveTab(AlbumType.ALBUM)}
          className={`px-4 py-1.5 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors ${
            activeTab === AlbumType.ALBUM
              ? "bg-foreground text-background"
              : "bg-sidebar text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          Album
        </button>

        <button
          onClick={() => setActiveTab(AlbumType.SINGLE)}
          className={`px-4 py-1.5 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors ${
            activeTab === AlbumType.SINGLE
              ? "bg-foreground text-background"
              : "bg-sidebar text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          Đĩa đơn (Single)
        </button>

        <button
          onClick={() => setActiveTab(AlbumType.EP)}
          className={`px-4 py-1.5 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors ${
            activeTab === AlbumType.EP
              ? "bg-foreground text-background"
              : "bg-sidebar text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          EP
        </button>

        <button
          onClick={() => setActiveTab(AlbumType.COMPILATION)}
          className={`px-4 py-1.5 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors ${
            activeTab === AlbumType.COMPILATION
              ? "bg-foreground text-background"
              : "bg-sidebar text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          Tuyển tập
        </button>
      </div>

      {isLoadingDiscography ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <AlbumCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      ) : discography.length === 0 ? (
        <p className="text-muted-foreground text-[14px]">
          Nghệ sĩ chưa có phát hành nào trong mục này.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {discography.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </section>
  );
}
