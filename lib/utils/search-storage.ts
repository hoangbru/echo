import { MAX_RECENT, RECENT_SEARCHES_KEY } from "@/constants/storage";

export interface SearchItem {
  id: string;
  type: "track" | "artist" | "album";
  title: string;
  subtitle: string;
  image: string | null;
  path: string;
  raw?: any;
}

export function loadRecentSearches(): SearchItem[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    return saved ? (JSON.parse(saved) as SearchItem[]) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearches(items: SearchItem[]): void {
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(items));
  } catch {
    // Fail silently if quota exceeded
  }
}

export function addToRecentSearches(item: SearchItem): void {
  const recents = loadRecentSearches();
  const next = [item, ...recents.filter((r) => r.id !== item.id)].slice(
    0,
    MAX_RECENT,
  );
  saveRecentSearches(next);
}
