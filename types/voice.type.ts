export type VoiceState = "idle" | "listening" | "processing" | "error";

export interface VoiceResult {
  audioBlob: Blob;
  audioDurationMs: number;
}

export type SearchIntent =
  | "song_name" // "cho tôi nghe bài Nơi Này Có Anh"
  | "artist" // "nhạc của Sơn Tùng"
  | "lyrics" // user đọc / hát lời bài hát
  | "humming" // ngân nga giai điệu, không có lời
  | "mood" // "nhạc buồn", "nhạc tập gym"
  | "unknown";

export type VoiceStatus = "idle" | "analyzing" | "done" | "error";

export interface HummingMatch {
  title: string; // tên bài hát Gemini nhận ra
  artist: string; // ca sĩ
  confidence: number; // 0–1, Gemini tự đánh giá mức chắc chắn
}

export interface GeminiVoiceResult {
  transcript: string; // nội dung nói, hoặc "[humming]"
  intent: SearchIntent;
  searchQuery: string; // query để feed vào search box
  confidence: number; // 0–1, chất lượng nhận dạng tổng thể
  language: "vi" | "en" | "other";
  hummingMatch: HummingMatch | null; // chỉ có khi intent === "humming" và nhận ra được
}
