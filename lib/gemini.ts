//   - STT (speech-to-text)
//   - Intent detection (tên bài / ca sĩ / lời / giai điệu / mood)
//   - Humming recognition (nhận dạng giai điệu ngân nga)

import { GeminiVoiceResult } from "@/types";
import { blobToBase64, getSupportedMimeType } from "./utils/helpers";
import { SYSTEM_PROMPT, USER_PROMPT } from "@/constants/prompt";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function analyzeVoiceWithGemini(
  audioBlob: Blob,
  apiKey: string
): Promise<GeminiVoiceResult> {
  const base64Audio = await blobToBase64(audioBlob);
  const mimeType = getSupportedMimeType(audioBlob);

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [
      {
        role: "user",
        parts: [
          { inline_data: { mime_type: mimeType, data: base64Audio } },
          { text: USER_PROMPT },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 512,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Gemini API ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const raw: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!raw) throw new Error("Gemini trả về response rỗng");

  const parsed = JSON.parse(
    raw.replace(/```json|```/g, "").trim(),
  ) as GeminiVoiceResult;

  return {
    transcript: parsed.transcript ?? "",
    intent: parsed.intent ?? "unknown",
    searchQuery: parsed.searchQuery ?? "",
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.8,
    language: parsed.language ?? "vi",
    hummingMatch: parsed.hummingMatch ?? null,
  };
}
