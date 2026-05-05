"use client";

import Link from "next/link";
import Image from "next/image";

import { VerifiedBadge } from "../verified-badge";

import { Artist } from "@/types/artist.type";

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link href={`/studio/${artist.id}`}>
      <div className="bg-neutral-900 rounded-lg p-4 hover:bg-neutral-800 transition text-center cursor-pointer">
        {/* Artist Image */}
        <div className="relative mb-4 aspect-square bg-neutral-800 rounded-full overflow-hidden mx-auto w-24 h-24">
          {artist.profileImage ? (
            <Image
              src={artist.profileImage}
              alt={artist.stageName || "Artist Image"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center">
              <div className="text-4xl">👤</div>
            </div>
          )}
        </div>

        {/* Artist Info */}
        <div className="flex items-center justify-center gap-1 mb-1">
          <p className="font-semibold text-sm truncate">{artist.stageName}</p>
          {artist.isVerified && <VerifiedBadge />}
        </div>

        <p className="text-xs text-neutral-400">
          {artist.totalFollowers?.toLocaleString() || 0} followers
        </p>
      </div>
    </Link>
  );
}
