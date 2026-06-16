"use client";

import Link from "next/link";
import Image from "next/image";
import { User as UserProfileIcon } from "lucide-react";

import { VerifiedBadge } from "../badge/verified-badge";

import { Artist } from "@/types/artist.type";

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link href={`/artist/${artist.id}`}>
      <div className="bg-card text-card-foreground rounded-lg p-4 hover:bg-accent hover:text-accent-foreground transition-colors text-center cursor-pointer border border-transparent hover:border-border">
        {/* Artist Image */}
        <div className="relative mb-4 aspect-square bg-secondary rounded-full overflow-hidden mx-auto w-24 h-24">
          {artist.profileImage ? (
            <Image
              src={artist.profileImage}
              alt={artist.stageName || "Artist Image"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary to-background flex items-center justify-center">
              <div className="text-4xl">
                <UserProfileIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Artist Info */}
        <div className="flex items-center justify-center gap-1 mb-1">
          <p className="font-semibold text-sm truncate">{artist.stageName}</p>
          {artist.isVerified && <VerifiedBadge />}
        </div>

        {/* <p className="text-xs text-muted-foreground">
      {artist.totalFollowers?.toLocaleString() || 0} followers
    </p> */}
      </div>
    </Link>
  );
}
