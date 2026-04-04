"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit2, Heart, Music } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/dist/client/components/navigation";

interface UserProfile {
  id: string;
  email?: string;
  fullName: string;
  avatarUrl: string;
  username: string;
  bio: string;
  followers: number;
  following: number;
  totalLikes: number;
  totalPlaylists: number;
  isPremium: boolean;
}

export default function ProfileClient({
  initialProfile,
}: {
  initialProfile: UserProfile;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    fullName: profile.fullName,
    bio: profile.bio,
  });

  const handleSaveProfile = () => {
    setProfile({
      ...profile,
      fullName: editForm.fullName,
      bio: editForm.bio,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ fullName: profile.fullName, bio: profile.bio });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/auth/login");
  };

  return (
    <div className="space-y-8 px-6 py-8">
      {/* Profile Header */}
      <div className="space-y-6">
        {/* Cover Image */}
        <div className="h-40 rounded-lg relative overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200"
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/50 mix-blend-overlay" />
        </div>

        {/* Profile Info */}
        <div className="flex gap-6 items-end -mt-16 relative z-10">
          <div className="h-32 w-32 rounded-full border-4 border-background overflow-hidden flex-shrink-0 relative">
            <Image
              src={profile.avatarUrl}
              alt={profile.fullName}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold text-foreground">
                {profile.fullName}
              </h1>
              {profile.isPremium && (
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(236,72,153,0.4)]">
                  Premium
                </span>
              )}
            </div>
            <p className="text-muted-foreground">@{profile.username}</p>

            {!isEditing && (
              <>
                <p className="text-foreground mt-2">{profile.bio}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 border-pink-500/60 text-pink-400 hover:bg-pink-500/10 hover:border-pink-500"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-[#111111] border border-white/5 rounded-xl p-6 space-y-4 shadow-[0_0_40px_rgba(236,72,153,0.05)]">
            <h3 className="text-lg font-semibold text-foreground">
              Edit Profile
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullName: e.target.value })
                  }
                  className="w-full rounded-lg bg-[#1A1A1A] border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Bio
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  className="w-full rounded-lg bg-[#1A1A1A] border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-white/10 hover:bg-white/5 text-white"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button
                className="bg-pink-500 text-white hover:bg-pink-600 shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-primary">
            {profile.followers.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Followers</div>
        </div>
        <div className="bg-card rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-primary">
            {profile.following.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Following</div>
        </div>
        <div className="bg-card rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-primary">
            {profile.totalLikes.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Liked Songs</div>
        </div>
        <div className="bg-card rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-primary">
            {profile.totalPlaylists}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Playlists</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/library/liked"
            className="group relative bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/20 flex items-center gap-4"
          >
            <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/25 group-hover:shadow-lg group-hover:shadow-primary/30">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Liked Songs</p>
              <p className="text-sm text-muted-foreground">
                {profile.totalLikes} songs
              </p>
            </div>
          </a>
          <a
            href="/library/playlists"
            className="group relative bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/20 flex items-center gap-4"
          >
            <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/25 group-hover:shadow-lg group-hover:shadow-primary/30">
              <Music className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Playlists</p>
              <p className="text-sm text-muted-foreground">
                {profile.totalPlaylists} playlists
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Account Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Account</h2>
        <Button
          variant="ghost"
          className="w-full justify-start bg-white/5 hover:bg-primary/5 hover:text-primary hover:border-l-2 hover:border-primary transition-all"
        >
          Change Password
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start bg-white/5 hover:bg-primary/5 hover:text-primary hover:border-l-2 hover:border-primary transition-all"
        >
          Download Your Data
        </Button>
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleSignOut}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}
