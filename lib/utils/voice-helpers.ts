export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = () => reject(new Error("Failed to read blob as base64"));
    reader.readAsDataURL(blob);
  });
}

export function getSupportedMimeType(blob: Blob): string {
  const supported = [
    "audio/webm",
    "audio/mp4",
    "audio/wav",
    "audio/ogg",
    "audio/mpeg",
  ];
  return supported.find((s) => blob.type.startsWith(s)) ?? "audio/webm";
}

/** Màu confidence: xanh ≥ 70%, vàng 40–69%, đỏ < 40% */
export function confidenceColor(value: number): string {
  if (value >= 0.7) return "text-green-400";
  if (value >= 0.4) return "text-yellow-400";
  return "text-red-400";
}

/** Làm tròn confidence thành % string */
export function confidencePct(value: number): string {
  return `${Math.round(value * 100)}%`;
}
