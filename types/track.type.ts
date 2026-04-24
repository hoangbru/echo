import { Database } from "@/lib/supabase/type";
import { TrackFormValues } from "@/lib/validations/track.schema";

export interface Track {
  id: string;
  title: string;
  title_search: string | null;
  image_url: string;
  is_explicit: boolean;
  is_published: boolean;
  audio_url: string;
  isrc: string | null;
  lyrics: string | null;
  preview_url: string | null;
  rating: number | null;
  release_date: string;
  album_id: string | null;
  artist_id: string;
  artist: {
    stage_name: string;
  };
  duration: number;
  genre_id: string | null;
  genre: {
    name: string;
  };
  created_at: string;
  updated_at: string;
  total_downloads: number;
  total_streams: number;
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
