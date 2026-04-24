"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Music, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Album } from "@/types";

interface AlbumCardProps {
  album: Album;
  onDelete: (album: Album) => void;
}

export function AlbumCard({ album, onDelete }: AlbumCardProps) {
  const router = useRouter();

  return (
    <div className="group bg-card border border-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all">
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 shadow-lg border border-white/10 bg-black/20">
        <Image
          src={album.coverImage || "/default-cover.jpg"}
          alt={album.title || "Album Cover"}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full h-10 w-10 hover:bg-white text-black"
            onClick={() => router.push(`/artist/albums/edit/${album.id}`)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="rounded-full h-10 w-10 bg-red-500 hover:bg-red-600"
            onClick={() => onDelete(album)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h3 className="text-white font-bold truncate">{album.title}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Music className="w-3 h-3 text-pink-500" />
            <p className="text-xs text-gray-400">
              {album.totalTracks || 0} Bài hát
            </p>
          </div>
        </div>

        {album.isPublished ? (
          <Globe className="w-4 h-4 text-green-500 shrink-0" />
        ) : (
          <Lock className="w-4 h-4 text-yellow-500 shrink-0" />
        )}
      </div>
    </div>
  );
}
