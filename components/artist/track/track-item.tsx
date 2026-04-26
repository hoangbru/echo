"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Edit2, Globe, Lock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackDetail } from "@/types";

interface TrackItemProps {
  track: TrackDetail;
  albumId: string;
  onDelete: (track: TrackDetail) => void;
}

export function TrackItem({ track, albumId, onDelete }: TrackItemProps) {
  const router = useRouter();

  const artistsText =
    track.trackArtists?.map((ta: any) => ta.artist.stageName).join(", ") ||
    "Unknown Artist";

  return (
    <tr className="group border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="py-3 px-4 w-12 text-center text-gray-500 font-bold text-sm">
        {track.trackNumber}
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 group/cover">
            <Image
              src={track.imageUrl || "/default-cover.jpg"}
              alt={track.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium truncate">{track.title}</p>
            <p className="text-xs text-gray-500">{track.isrc || "No ISRC"}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-sm text-gray-400">
        {track.genreName || "N/A"}
      </td>

      <td className="py-4 px-4">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
            track.isPublished
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
          }`}
        >
          {track.isPublished ? (
            <Globe className="w-3 h-3" />
          ) : (
            <Lock className="w-3 h-3" />
          )}
          {track.isPublished ? "Public" : "Private"}
        </div>
      </td>
      <td className="py-4 px-4 text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              router.push(`/artist/albums/${albumId}/tracks/edit/${track.id}`)
            }
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
