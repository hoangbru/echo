export type SearchIntent =
  | "song_name"
  | "artist"
  | "lyrics"
  | "humming"
  | "mood"
  | "unknown";

export type ModalPhase = "listening" | "processing" | "result" | "error";

export interface HummingMatch {
  title: string;
  artist: string;
  confidence: number; // 0–1
}

export interface GeminiVoiceResult {
  transcript: string;
  intent: SearchIntent;
  searchQuery: string;
  confidence: number;
  language: "vi" | "en" | "other";
  hummingMatch: HummingMatch | null;
}

export interface VoiceModalResult {
  query: string;
  geminiResult: GeminiVoiceResult;
}
