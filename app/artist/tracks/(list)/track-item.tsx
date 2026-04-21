"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit2, Trash2, Play, Pause, Globe, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Track } from "@/types/track.type";

export function TrackItem({
  track,
  onEdit,
  onDelete,
}: {
  track: Track;
  onEdit: (t: Track) => void;
  onDelete: (track: Track) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <tr className="group border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 group/cover">
            <Image
              src={track.image_url || "/default-cover.jpg"}
              alt={track.title}
              fill
              className="object-cover"
            />
            <button
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white fill-white" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white" />
              )}
            </button>
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium truncate">{track.title}</p>
            <p className="text-xs text-gray-500">{track.isrc || "No ISRC"}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-sm text-gray-400">
        {track.genre?.name || "N/A"}
      </td>
      <td className="py-4 px-4 text-sm text-gray-400">
        {new Date(track.release_date).toLocaleDateString("vi-VN")}
      </td>
      <td className="py-4 px-4">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
            track.is_published
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
          }`}
        >
          {track.is_published ? (
            <Globe className="w-3 h-3" />
          ) : (
            <Lock className="w-3 h-3" />
          )}
          {track.is_published ? "Public" : "Private"}
        </div>
      </td>
      <td className="py-4 px-4 text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(track)}
            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
          >
            <Edit2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(track)}
            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
