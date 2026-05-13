export const VOICE_SYSTEM_PROMPT = `Bạn là AI chuyên phân tích audio cho ứng dụng nghe nhạc.
Bạn có khả năng:
1. Nhận dạng giọng nói tiếng Việt và tiếng Anh
2. Phân loại ý định tìm kiếm nhạc
3. Nhận dạng giai điệu khi người dùng ngân nga (humming)

Luôn trả về JSON hợp lệ duy nhất, không có markdown, không có giải thích.`;

export const VOICE_USER_PROMPT = `Phân tích audio và trả về JSON theo đúng format:

{
  "transcript": "nội dung người dùng nói, hoặc '[humming]' nếu chỉ ngân nga",
  "intent": "song_name | artist | lyrics | humming | mood | unknown",
  "searchQuery": "query tối ưu để tìm nhạc (xem quy tắc bên dưới)",
  "confidence": 0.95,
  "language": "vi | en | other",
  "hummingMatch": null
}

Quy tắc searchQuery theo intent:
- song_name → tên bài hát sạch (bỏ "bài", "bản", "cho tôi nghe", "phát", "mở")
- artist    → tên nghệ sĩ / nhóm nhạc
- lyrics    → đoạn lời đặc trưng nhất (3–7 từ)
- mood      → tag chuẩn hóa: "nhạc buồn" / "nhạc chill" / "nhạc tập gym" / "nhạc vui"
- humming   → searchQuery = "" VÀ nếu nhận ra giai điệu điền hummingMatch:
              { "title": "tên bài", "artist": "tên ca sĩ", "confidence": 0.0–1.0 }
              Nếu không nhận ra → hummingMatch = null
- unknown   → searchQuery = transcript nguyên văn

Chỉ trả về JSON duy nhất, không thêm bất kỳ ký tự nào khác.`;

export const INTENT_LABELS: Record<string, string> = {
  song_name: "🎵 Tên bài hát",
  artist: "🎤 Ca sĩ / nghệ sĩ",
  lyrics: "📝 Lời bài hát",
  humming: "🎼 Giai điệu",
  mood: "💫 Tâm trạng / thể loại",
  unknown: "🔍 Tìm kiếm",
};
