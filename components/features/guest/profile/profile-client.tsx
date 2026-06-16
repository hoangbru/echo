"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MoreHorizontal, Loader2, Music, UserCheck, Edit2 } from "lucide-react";

import { useFollowedArtists, useProfile } from "@/hooks/use-profile";
import { usePlaylists } from "@/hooks/use-playlists";
import { ProfileEditModal } from "./profile-edit-modal";

export function ProfileClient() {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Lấy thông tin Profile
  const { data: profile, isLoading: isLoadingProfile, error } = useProfile();

  // Lấy Playlists
  const { data: playlistsRes, isLoading: isLoadingPlaylists } = usePlaylists(
    { status: "public", limit: 6 },
    !!profile?.id,
  );
  const publicPlaylists = playlistsRes?.data || [];

  const { data: followedArtists = [], isLoading: isLoadingArtists } =
    useFollowedArtists();

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) return <div>Lỗi tải dữ liệu</div>;

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      {/* HEADER SECTION */}
      <div className="pt-20 pb-8 px-8 bg-gradient-to-b from-card to-background flex items-end gap-6 group">
        <div
          className="h-48 w-48 rounded-full shadow-2xl overflow-hidden relative flex-shrink-0 bg-sidebar cursor-pointer"
          onClick={() => setIsEditModalOpen(true)}
        >
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt="Avatar"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex w-full h-full items-center justify-center bg-card text-muted-foreground">
              <span className="text-7xl font-bold uppercase">
                {(profile.fullName || profile.username || "U")[0]}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-end gap-1 pb-2">
          <span className="text-[14px] font-medium uppercase tracking-wider text-foreground">
            Hồ sơ
          </span>

          <h1
            className="text-5xl md:text-7xl font-black tracking-tighter cursor-pointer hover:underline text-foreground my-1"
            onClick={() => setIsEditModalOpen(true)}
          >
            {profile.fullName || profile.username}
          </h1>

          {profile.fullName && profile.fullName !== profile.username && (
            <span className="text-[16px] text-muted-foreground font-medium mb-1">
              @{profile.username}
            </span>
          )}

          {profile.bio && (
            <p className="text-[14px] md:text-[16px] text-muted-foreground line-clamp-2 max-w-3xl mt-2 mb-3">
              {profile.bio}
            </p>
          )}

          <div className="text-[14px] text-muted-foreground font-medium flex items-center gap-1.5 mt-2">
            <span className="text-foreground font-bold">
              {publicPlaylists.length || 0}
            </span>{" "}
            danh sách phát công khai
            <span className="text-[10px] mx-1">•</span>
            <span className="text-foreground font-bold">
              {followedArtists.length || 0}
            </span>{" "}
            Đang theo dõi
          </div>
        </div>
      </div>

      <div className="px-8 space-y-12">
        {/* ACTION BAR */}
        <div className="flex items-center gap-6 pt-4">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Edit2 className="w-6 h-6" />
          </button>
        </div>

        <section className="space-y-4">
          <h2 className="text-[24px] font-bold text-foreground">
            Đang theo dõi
          </h2>

          {isLoadingArtists ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 bg-card rounded-xl animate-pulse">
                  <div className="w-full aspect-square rounded-full bg-muted/50 mb-4" />
                  <div className="h-4 bg-muted/50 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-muted/50 rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : followedArtists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {followedArtists.map((artist: any) => (
                <div
                  key={artist.id}
                  onClick={() => router.push(`/artist/${artist.id}`)}
                  className="p-4 bg-card hover:bg-accent rounded-xl transition-colors group cursor-pointer text-center md:text-left"
                >
                  <div className="w-full aspect-square rounded-full overflow-hidden relative mb-4 shadow-lg group-hover:shadow-xl bg-border">
                    <Image
                      src={artist.profileImage || "/default-avatar.jpg"}
                      alt={artist.stageName}
                      fill
                      sizes="(max-width: 640px) 50vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-[16px] text-foreground truncate">
                    {artist.stageName}
                  </h3>
                  <p className="text-[14px] text-muted-foreground truncate mt-1">
                    Nghệ sĩ
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 bg-card/50 rounded-xl border border-dashed border-border">
              <UserCheck className="w-12 h-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground text-[14px]">
                Bạn chưa theo dõi nghệ sĩ nào.
              </p>
            </div>
          )}
        </section>

        {/* --- SECTION: PUBLIC PLAYLISTS --- */}
        <section className="space-y-4">
          <h2 className="text-[24px] font-bold text-foreground hover:underline cursor-pointer">
            Playlists Công khai
          </h2>

          {isLoadingPlaylists ? (
            // Skeleton cho Playlist
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 bg-card rounded-xl animate-pulse">
                  <div className="w-full aspect-square rounded-md bg-muted/50 mb-4" />
                  <div className="h-4 bg-muted/50 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted/50 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : publicPlaylists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {publicPlaylists.map((playlist: any) => (
                <div
                  key={playlist.id}
                  onClick={() =>
                    router.push(`/library/playlists/${playlist.id}`)
                  }
                  className="p-4 bg-card hover:bg-accent rounded-xl transition-colors group cursor-pointer"
                >
                  <div className="w-full aspect-square rounded-md overflow-hidden relative mb-4 shadow-lg group-hover:shadow-xl bg-border flex items-center justify-center">
                    {playlist.coverImage ? (
                      <Image
                        src={playlist.coverImage}
                        alt={playlist.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Music className="w-12 h-12 text-muted-foreground/50" />
                    )}
                  </div>
                  <h3 className="font-semibold text-[16px] text-foreground truncate">
                    {playlist.title}
                  </h3>
                  <p className="text-[14px] text-muted-foreground truncate mt-1">
                    Bởi {playlist.user?.username || profile.username}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-[14px]">
              Người dùng này chưa có danh sách phát công khai nào.
            </p>
          )}
        </section>
      </div>

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
      />
    </div>
  );
}
