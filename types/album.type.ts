import { Database } from "@/lib/supabase/type";
import { Track } from "./track.type";
import { AlbumFormValues } from "@/lib/validations/album.schema";
import { AlbumType } from "./enum.type";

export interface AlbumCard {
  id: string;
  title: string;
  cover_image: string | null;
  is_published: boolean;
  release_date: string;
}

export interface Album {
  id: string;
  title: string;
  titleSearch: string | null;
  releaseDate: string;
  coverImage: string | null;
  slug: string | null;
  albumType: AlbumType | null;
  artistId: string;
  description: string | null;
  genreId: string | null;
  isExplicit: boolean | null;
  isPublished: boolean;
  recordLabel: string | null;
  upc: string | null;
  language: string | null;
  copyright: string | null;
  rating: number | null;
  totalStreams: number;
  totalTracks: number;
  createdAt: string;
  updatedAt: string;
  tracks?: Track[];
}

export type AlbumDB = Database["public"]["Tables"]["album"]["Row"];

export interface CreateAlbumParams {
  formData: AlbumFormValues;
  artistId: string;
  coverFile: File | null;
}

export interface UpdateAlbumParams {
  albumId: string;
  formData: AlbumFormValues;
  artistId: string;
  coverFile: File | null;
  oldCoverUrl: string | null;
}
