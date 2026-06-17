import { Json } from "@/lib/supabase/type";
import { ArtistRequestStatus } from "./enum.type";

export interface Artist {
  id: string;
  userId: string;

  stageName: string | null;
  stageNameSearch: string | null;
  bio: string | null;

  profileImage: string | null;
  bannerImage: string | null;
  socialLinks: Json | null;
  contactEmail: string | null;

  totalTracks: number;
  totalAlbums: number;
  totalStreams: number;
  totalFollowers: number;

  isVerified: boolean;

  createdAt: string;
  updatedAt: string;
  verifiedAt: string | null;
}

export interface ArtistProfile extends Artist {}

export interface ArtistRequest {
  id: string;
  userId: string;

  stageName: string | null;
  contactEmail: string;
  bio: string | null;

  profileImage: string;
  demoLink: string;
  socialLinks: Json | null;

  status: ArtistRequestStatus;
  agreedToTerms: boolean;

  reviewComment: string | null;
  reviewedBy: string | null;

  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
}
