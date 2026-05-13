export interface LyricLine {
  time: number;
  text: string;
}

export function parseLRC(lrcText: string): LyricLine[] {
  if (!lrcText) return [];

  const lines = lrcText.split("\n");
  const parsedLyrics: LyricLine[] = [];

  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  lines.forEach((line) => {
    const match = timeRegex.exec(line);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3], 10);

      const timeInSeconds =
        minutes * 60 +
        seconds +
        milliseconds / (match[3].length === 3 ? 1000 : 100);

      const text = line.replace(timeRegex, "").trim();

      if (text) {
        parsedLyrics.push({ time: timeInSeconds, text });
      }
    }
  });

  return parsedLyrics;
}
