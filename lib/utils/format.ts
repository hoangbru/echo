/**
 * Format seconds to MM:SS
 */
export function formatTime(seconds: number | undefined): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format large numbers
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export type DateFormatView = "full" | "yearOnly";

export function formatDate(
  date: string | Date,
  viewMode: DateFormatView = "full",
  options?: Intl.DateTimeFormatOptions,
): string {
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return "Không xác định";
  }

  const baseOptions: Intl.DateTimeFormatOptions =
    viewMode === "yearOnly"
      ? { year: "numeric" }
      : { year: "numeric", month: "long", day: "numeric" };

  return parsedDate.toLocaleDateString("vi-VN", {
    ...baseOptions,
    ...options,
  });
}

/**
 * Format duration in seconds to MM:SS
 */
export const formatDuration = (seconds: number | null) => {
  if (!seconds) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const keysToCamel = (obj: any): any => {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) return obj.map(keysToCamel);

  const newObj: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

    newObj[camelKey] = keysToCamel(obj[key]);
  }
  return newObj;
};

/**
 * Format elapsed time in seconds
 * @param ms milliseconds
 * @returns formatted string like "5s"
 */
export const formatElapsed = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${s}s`;
};

export function mapTrackRow(row: any, similarity?: number): any {
  const albumRaw = Array.isArray(row.album) ? row.album[0] : row.album;

  const artists = (row.track_artists ?? [])
    .map((ta: any) => {
      const a = Array.isArray(ta.artist) ? ta.artist[0] : ta.artist;
      return {
        id: a?.id ?? null,
        stage_name: a?.stage_name ?? null,
        profile_image: a?.profile_image ?? null,
        is_main: ta.is_main ?? false,
        is_verified: a?.is_verified ?? false,
      };
    })
    .sort((a: any, b: any) =>
      a.is_main === b.is_main ? 0 : a.is_main ? -1 : 1,
    );

  return {
    id: row.id,
    title: row.title,
    audio_url: row.audio_url,
    image_url: row.image_url ?? albumRaw?.cover_image ?? null,
    duration: row.duration,
    is_explicit: row.is_explicit,
    artists,
    album: albumRaw
      ? {
          id: albumRaw.id,
          title: albumRaw.title ?? null,
          cover_image: albumRaw.cover_image ?? null,
        }
      : null,
    ...(similarity !== undefined ? { similarity } : {}),
  };
}
