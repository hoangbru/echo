import { GoogleGenAI, type EmbedContentConfig } from "@google/genai";
import {
  GEMINI_GENERATE_MODEL,
  GEMINI_EMBEDDING_MODEL,
} from "@/constants/search";
import {
  VOICE_SYSTEM_PROMPT,
  VOICE_USER_PROMPT,
} from "@/constants/voice-prompts";
import { stripLrcTimestamps } from "@/lib/utils/lyrics";
import type { VoiceAnalysisResult } from "@/types/search";

const MAX_LYRICS_CHARS = 3000; // ~750 tokens, enough to capture full song content

function createClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  return new GoogleGenAI({ apiKey });
}

// ── Voice analysis ────────────────────────────────────────────────────────────

/**
 * Analyze audio and return structured search intent.
 */
export async function analyzeVoice(
  audioBase64: string,
  mimeType: string,
): Promise<VoiceAnalysisResult> {
  const ai = createClient();

  const response = await ai.models.generateContent({
    model: GEMINI_GENERATE_MODEL,
    config: {
      systemInstruction: VOICE_SYSTEM_PROMPT,
      temperature: 0.2,
      maxOutputTokens: 512,
      responseMimeType: "application/json",
    },
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType, data: audioBase64 } },
          { text: VOICE_USER_PROMPT },
        ],
      },
    ],
  });

  const raw = response.text ?? "";
  if (!raw) throw new Error("Empty response from Gemini");

  const parsed = JSON.parse(
    raw.replace(/```json|```/g, "").trim(),
  ) as VoiceAnalysisResult;

  return {
    transcript: parsed.transcript ?? "",
    intent: parsed.intent ?? "unknown",
    searchQuery: parsed.searchQuery ?? "",
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.8,
    language: parsed.language ?? "vi",
    hummingMatch: parsed.hummingMatch ?? null,
  };
}

// ── Embeddings ────────────────────────────────────────────────────────────────

async function embedText(
  text: string,
  taskType: EmbedContentConfig["taskType"],
): Promise<number[]> {
  if (!text.trim()) throw new Error("Cannot embed empty text");

  const ai = createClient();

  const response = await ai.models.embedContent({
    model: GEMINI_EMBEDDING_MODEL,
    contents: text,
    config: { taskType, outputDimensionality: 768 },
  });

  const values = response.embeddings?.[0]?.values;
  if (!values?.length) throw new Error("Empty embedding response");

  return values;
}

/**
 * Embed track lyrics for storage.
 * Strips LRC timestamps and truncates before sending to Gemini.
 */
export async function embedLyrics(lyrics: string): Promise<number[]> {
  const clean = stripLrcTimestamps(lyrics).slice(0, MAX_LYRICS_CHARS);
  if (!clean) throw new Error("Lyrics are empty after processing");
  return embedText(clean, "RETRIEVAL_DOCUMENT");
}

/**
 * Embed a user's lyric query for similarity search.
 */
export async function embedQuery(query: string): Promise<number[]> {
  return embedText(query.trim(), "RETRIEVAL_QUERY");
}
