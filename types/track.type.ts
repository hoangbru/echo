import { Database } from "@/lib/supabase/type";
import { TrackFormValues } from "@/lib/validations/track.schema";

export interface Track {
  id: string;
  title: string;
  slug: string | null;
  isrc: string | null; // International Standard Recording Code

  artistId: string;
  albumId: string | null;
  genreId: string | null;
  genreName: string | null;

  audioUrl: string;
  imageUrl: string | null;
  duration: number;
  lyrics: string | null;
  isExplicit: boolean;
  language: string | null;

  bitrate: number | null;
  fileSize: number | null;
  trackNumber: number | null;
  discNumber: number | null;

  composer: string | null;
  lyricist: string | null;
  producer: string | null;

  isPublished: boolean;
  totalStreams: number;
  totalDownloads: number;
  titleSearch: string | null;

  createdAt: Date | string;
  updatedAt: Date | string;
}

export type TrackDB = Database["public"]["Tables"]["track"]["Row"];

export interface CreateTrackParams {
  formData: TrackFormValues;
  artistId: string;
  musicFile: File;
  coverFile: File | null;
  selectedAlbumCover?: string | null;
  duration: number | null;
}

export interface UpdateTrackParams {
  trackId: string;
  artistId: string;
  formData: TrackFormValues;
  coverFile: File | null;
  oldCoverUrl: string | null;
  clearCustomCover: boolean;
  albumCoverUrl?: string | null;
}

export interface TrackDetail extends Track {
  artist?: {
    id: string;
    stageName: string;
    avatar: string | null;
  };
  album?: {
    id: string;
    title: string;
    coverImage: string | null;
  };
  trackArtists?: TrackArtists[];
}

export interface TrackArtists {
  artist: {
    id: string;
    stageName: string;
    profileImage: string | null;
  };
  isMain: boolean;
}
