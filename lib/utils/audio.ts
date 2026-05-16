const SUPPORTED_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg",
];

/** Return the best supported MediaRecorder MIME type for this browser. */
export function getBestMimeType(): string {
  return (
    SUPPORTED_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) ??
    "audio/webm"
  );
}

/** Return a normalized MIME type suitable for Gemini API. */
export function getNormalizedMimeType(blob: Blob): string {
  const supported = [
    "audio/webm",
    "audio/mp4",
    "audio/wav",
    "audio/ogg",
    "audio/mpeg",
  ];
  return supported.find((s) => blob.type.startsWith(s)) ?? "audio/webm";
}
