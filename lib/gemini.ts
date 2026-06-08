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

const MAX_LYRICS_CHARS = 3000;

function createClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  return new GoogleGenAI({ apiKey });
}

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
      temperature: 0.1, // Lower temp for more deterministic JSON output
      maxOutputTokens: 512,
      responseMimeType: "application/json",
      thinkingConfig: {
        thinkingBudget: 0,
      },
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
  ) as VoiceAnalysisResult & { hummingCandidates?: any[] };

  let hummingMatch = parsed.hummingMatch ?? null;
  if (
    parsed.intent === "humming" &&
    Array.isArray(parsed.hummingCandidates) &&
    parsed.hummingCandidates.length > 0
  ) {
    const best = parsed.hummingCandidates[0];
    hummingMatch = best.confidence >= 0.6 ? best : null;
  }

  return {
    transcript: parsed.transcript ?? "",
    intent: parsed.intent ?? "unknown",
    searchQuery: parsed.searchQuery ?? "",
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.8,
    language: parsed.language ?? "vi",
    hummingMatch,
  };
}

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

export async function embedLyrics(lyrics: string): Promise<number[]> {
  const clean = stripLrcTimestamps(lyrics).slice(0, MAX_LYRICS_CHARS);
  if (!clean) throw new Error("Lyrics are empty after processing");
  return embedText(clean, "RETRIEVAL_DOCUMENT");
}

export async function embedQuery(query: string): Promise<number[]> {
  return embedText(query.trim(), "RETRIEVAL_QUERY");
}
