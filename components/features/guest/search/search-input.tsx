"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

import { SearchDropdown } from ".";

import { useDebounce } from "@/hooks/use-debounce";
import { useSearch } from "@/hooks/use-search";

export function SearchInput() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 500);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: results, isLoading } = useSearch(debouncedQuery);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />

        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Bạn muốn phát gì?"
          className="w-full h-12 rounded-full bg-[#242424] hover:bg-[#2a2a2a] border border-transparent px-4 py-2 pl-12 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:bg-[#2a2a2a] focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");

              const input = containerRef.current?.querySelector("input");
              if (input) input.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <SearchDropdown
          searchTerm={query}
          results={results?.data}
          isLoading={isLoading && query.trim().length > 0}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
