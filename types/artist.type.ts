import { Database, Json } from "@/lib/supabase/type";
import { ArtistRequestStatus } from "./enum.type";

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

export interface ArtistRequest {
  id: string;
  stageName: string | null;
  bio: string | null;
  contactEmail: string;
  demoLink: string;
  profileImage: string;
  agreedToTerms: boolean;
  reviewComment: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  socialLinks: Json | null;
  status: ArtistRequestStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type ArtistDB = Database["public"]["Tables"]["artist"]["Row"];
