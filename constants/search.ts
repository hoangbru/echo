import type { SearchIntent, SearchType } from "@/types/search";

/** Map Gemini intent → API types param */
export const INTENT_TO_SEARCH_TYPES: Partial<
  Record<SearchIntent, SearchType[]>
> = {
  song_name: ["track"],
  artist: ["artist"],
  lyrics: ["lyrics"],
  mood: ["track"],
  // humming resolves to title search after hummingMatch.title is extracted
  // unknown falls back to all types
};

export const DEFAULT_SEARCH_TYPES: SearchType[] = ["track", "artist", "album"];

export const INTENT_LABELS: Record<SearchIntent, string> = {
  song_name: "🎵 Tên bài hát",
  artist: "🎤 Ca sĩ / nghệ sĩ",
  lyrics: "📝 Lời bài hát",
  humming: "🎼 Giai điệu",
  mood: "💫 Tâm trạng / thể loại",
  unknown: "🔍 Tìm kiếm",
};

/** Gemini model names */
export const GEMINI_GENERATE_MODEL = "gemini-2.5-flash";
export const GEMINI_EMBEDDING_MODEL = "gemini-embedding-001";
