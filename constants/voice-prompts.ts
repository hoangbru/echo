export const VOICE_SYSTEM_PROMPT = `You are an AI assistant for a music streaming app.
Analyze the user's audio and classify their search intent.
Always respond with valid JSON only — no markdown, no explanation.`;

export const VOICE_USER_PROMPT = `Analyze the audio and return JSON in this exact shape:
{
  "transcript": "what the user said, or '[humming]' if they only hummed",
  "intent": "song_name | artist | lyrics | humming | mood | unknown",
  "searchQuery": "optimized search query (see rules below)",
  "confidence": 0.95,
  "language": "vi | en | other",
  "hummingMatch": null
}

searchQuery rules by intent:
- song_name → clean song title (strip filler words: "play", "open", "bài", "cho tôi nghe")
- artist    → artist or band name only
- lyrics    → most distinctive phrase from the lyric (3–7 words)
- mood      → normalized tag: "nhạc buồn" | "nhạc chill" | "nhạc tập gym" | "nhạc vui"
- humming   → searchQuery = "" AND fill hummingMatch if recognized:
              { "title": "song title", "artist": "artist name", "confidence": 0.0–1.0 }
              If unrecognized → hummingMatch = null
- unknown   → searchQuery = transcript verbatim

Return JSON only. No extra characters.`;
