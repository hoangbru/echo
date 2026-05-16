import { NextRequest, NextResponse } from "next/server";
import { analyzeVoice } from "@/lib/gemini";

const MAX_AUDIO_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_AUDIO_BYTES) {
    return NextResponse.json(
      { error: "Audio file too large" },
      { status: 413 },
    );
  }

  let buffer: ArrayBuffer;
  try {
    buffer = await req.arrayBuffer();
  } catch {
    return NextResponse.json(
      { error: "Could not read audio data" },
      { status: 400 },
    );
  }

  if (!buffer.byteLength) {
    return NextResponse.json({ error: "Empty audio" }, { status: 400 });
  }

  const audioBase64 = Buffer.from(buffer).toString("base64");
  const mimeType = req.headers.get("content-type") || "audio/webm";

  try {
    const result = await analyzeVoice(audioBase64, mimeType);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[voice/analyze]", err);
    return NextResponse.json(
      { error: "Voice analysis failed, please try again" },
      { status: 502 },
    );
  }
}
