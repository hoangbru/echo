import { TrackDetail } from "./track.type";

export type Playlist = {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  isPublic: boolean;
  userId: string;
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
  createdAt: string;
  updatedAt: string;
};

export type PlaylistDetail = Playlist & {
  tracks: (TrackDetail & { addedAt: string; position: number })[];
};

export type Tab = "track" | "album" | "artist";
