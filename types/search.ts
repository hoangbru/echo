export type SearchType = "track" | "artist" | "album" | "lyrics";

export type SearchIntent =
  | "song_name"
  | "artist"
  | "lyrics"
  | "humming"
  | "mood"
  | "unknown";

export type VoicePhase = "listening" | "processing" | "result" | "error";

export interface HummingMatch {
  title: string;
  artist: string;
  confidence: number; // 0–1
}

export interface VoiceAnalysisResult {
  transcript: string;
  intent: SearchIntent;
  searchQuery: string;
  confidence: number; // 0–1
  language: "vi" | "en" | "other";
  hummingMatch: HummingMatch | null;
}

export interface VoiceSearchPayload {
  query: string;
  intent: SearchIntent;
}

// Shape returned by /api/search
export interface TrackResult {
  id: string;
  title: string;
  audioUrl: string;
  imageUrl: string | null;
  duration: number;
  isExplicit: boolean;
  artists: ArtistResult[];
  album: { id: string } | null;
  similarity?: number; // only present for lyrics search
}

export interface ArtistResult {
  id: string;
  stageName: string;
  profileImage: string | null;
  isVerified?: boolean;
  isMain?: boolean;
}

export interface AlbumResult {
  id: string;
  title: string;
  coverImage: string | null;
  albumType: string;
  isExplicit: boolean;
  artist: { id: string; stageName: string } | null;
}

export interface SearchResults {
  tracks: TrackResult[];
  artists: ArtistResult[];
  albums: AlbumResult[];
}
