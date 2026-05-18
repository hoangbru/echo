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
  slug: string | null;

  title: string;
  titleSearch: string | null;
  description: string | null;
  coverImage: string | null;
  releaseDate: string;
  albumType: AlbumType | null;
  language: string | null;
  genreId: string | null;

  isExplicit: boolean | null;
  isPublished: boolean;
  recordLabel: string | null;
  upc: string | null;
  copyright: string | null;

  rating: number | null;
  totalStreams: number;
  totalTracks: number;

  createdAt: string;
  updatedAt: string;

  artistId: string;
}

export interface AlbumDetail extends Album {
  genre: {
    id: string;
    name: string;
  } | null;
  artist: {
    id: string;
    stageName: string;
    profileImage: string | null;
  };
}

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
