import { Database } from "@/lib/supabase/type";

export interface Track {
  albumId: string | null;
  artistId: string;
  audioUrl: string;
  createdAt: string;
  duration: number;
  genreId: string | null;
  genre: {
    name: string;
  };
  id: string;
  imageUrl: string;
  isExplicit: boolean;
  isPublished: boolean;
  isrc: string | null;
  lyrics: string | null;
  previewUrl: string | null;
  rating: number | null;
  releaseDate: string;
  title: string;
  titleSearch: string | null;
  totalDownloads: number;
  totalStreams: number;
  updatedAt: string;
}

export type TrackDB = Database["public"]["Tables"]["track"]["Row"];
