/** Tailwind text color class based on confidence score. */
export function confidenceColorClass(value: number): string {
  if (value >= 0.7) return "text-green-400";
  if (value >= 0.4) return "text-yellow-400";
  return "text-red-400";
}

/** Format confidence as percentage string. */
export function formatConfidence(value: number): string {
  return `${Math.round(value * 100)}%`;
}
