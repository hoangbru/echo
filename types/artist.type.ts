import { Json } from "@/lib/supabase/type";

export interface Artist {
  bannerImage: string | null;
  bio: string | null;
  createdAt: string;
  id: string;
  isVerified: boolean;
  profileImage: string | null;
  socialLinks: Json | null;
  stageName: string | null;
  totalAlbums: number;
  totalFollowers: number;
  totalStreams: number;
  totalTracks: number;
  updatedAt: string;
  userId: string;
  verifiedAt: string | null;
}
