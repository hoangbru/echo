import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import {
  INTENT_TO_SEARCH_TYPES,
  DEFAULT_SEARCH_TYPES,
} from "@/constants/search";
import type { SearchIntent, SearchType, SearchResults } from "@/types/search";

interface Options {
  intent?: SearchIntent;
  types?: SearchType[];
  enabled?: boolean;
}

export function useSearch(
  query: string,
  { intent, types, enabled }: Options = {},
) {
  const resolvedTypes: SearchType[] =
    types ??
    (intent ? INTENT_TO_SEARCH_TYPES[intent] : undefined) ??
    DEFAULT_SEARCH_TYPES;

  return useQuery<{ data: SearchResults }>({
    queryKey: ["search", query, resolvedTypes],
    queryFn: async () => {
      const res = await apiClient.get<{ data: SearchResults }>("/search", {
        params: { q: query, types: resolvedTypes.join(",") },
      });
      return res.data;
    },
    enabled: query.trim().length > 0 && (enabled ?? true),
    staleTime: 5 * 60 * 1000,
  });
}
