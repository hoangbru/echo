"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Mic } from "lucide-react";

import { SearchDropdown } from "./search-dropdown";
import { VoiceSearchModal } from "./voice-search-modal";

import { useSearch } from "@/hooks/use-search";
import { useDebounce } from "@/hooks/use-debounce";
import type { SearchIntent, VoiceSearchPayload } from "@/types/search";

export function SearchInput() {
  const [query, setQuery] = useState("");
  const [intent, setIntent] = useState<SearchIntent | undefined>();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 500);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useSearch(debouncedQuery, { intent });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIntent(undefined);
    setDropdownOpen(true);
  };

  const handleVoiceSearch = ({ query: q, intent: i }: VoiceSearchPayload) => {
    setModalOpen(false);
    setQuery(q);
    setIntent(i);
    setDropdownOpen(true);
    setTimeout(() => inputRef.current?.focus(), 220);
  };

  const handleClear = () => {
    setQuery("");
    setIntent(undefined);
    setDropdownOpen(false);
    inputRef.current?.focus();
  };

  return (
    <>
      <VoiceSearchModal
        isOpen={isModalOpen}
        onSearch={handleVoiceSearch}
        onClose={() => setModalOpen(false)}
      />

      <div ref={containerRef} className="relative w-full max-w-md">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={() => setDropdownOpen(true)}
            onChange={handleInputChange}
            placeholder="Bạn muốn phát gì?"
            className="w-full h-12 rounded-full bg-secondary hover:bg-secondary/80 border border-transparent pl-12 pr-20 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-secondary/80 focus:border-border focus:ring-1 focus:ring-ring/30 transition-all"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                aria-label="Clear"
                onClick={handleClear}
                className="flex items-center justify-center w-6 h-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              >
                <X size={13} />
              </button>
            )}
            <button
              type="button"
              aria-label="Search by voice"
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
            >
              <Mic size={17} />
            </button>
          </div>
        </div>

        {isDropdownOpen && !isModalOpen && (
          <SearchDropdown
            searchTerm={query}
            results={data}
            isLoading={isLoading && query.trim().length > 0}
            onClose={() => setDropdownOpen(false)}
          />
        )}
      </div>
    </>
  );
}
