import { VerifiedBadge } from "@/components/shared/badge";
import { ArtistProfile } from "@/types";
import Image from "next/image";

interface ArtistHeaderProps {
  artist: ArtistProfile;
}
export function ArtistHeaderSkeleton() {
  return (
    <div className="relative w-full p-8 pt-20 animate-pulse">
      <div className="absolute inset-0 z-0 bg-muted/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
        <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden shadow-2xl border-4 border-background bg-muted/50" />

        <div className="flex flex-col gap-3 text-center md:text-left flex-1 w-full items-center md:items-start">
          <div className="h-5 bg-muted/40 rounded w-32" />

          <div className="h-[40px] md:h-[64px] bg-muted/50 rounded w-3/4 max-w-md mt-2" />

          <div className="flex flex-col gap-2 w-full max-w-3xl mt-4">
            <div className="h-4 bg-muted/40 rounded w-full" />
            <div className="h-4 bg-muted/40 rounded w-5/6" />
            <div className="h-4 bg-muted/40 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
export function ArtistHeader({ artist }: ArtistHeaderProps) {
  return (
    <div className="relative w-full p-8 pt-20">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          alt={`banner-image-${artist.stageName}`}
          src={artist.bannerImage || "/default-banner.jpg"}
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
        <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden shadow-2xl border-4 border-background">
          <Image
            alt={`profile-image-${artist.stageName}`}
            src={artist.profileImage || "/default-avatar.jpg"}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-2 text-center md:text-left flex-1">
          {artist.isVerified && (
            <div className="flex items-center justify-center md:justify-start gap-2">
              <VerifiedBadge />
              <span className="text-base font-medium text-foreground">
                Nghệ sĩ xác minh
              </span>
            </div>
          )}

          <h1 className="text-[40px] md:text-[64px] font-bold text-foreground leading-none tracking-tight">
            {artist.stageName}
          </h1>

          <p className="text-[16px] text-muted-foreground mt-2 max-w-3xl line-clamp-3">
            {artist.bio || "Nghệ sĩ này chưa có thông tin tiểu sử."}
          </p>
        </div>
      </div>
    </div>
  );
}
