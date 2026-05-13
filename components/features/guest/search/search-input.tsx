"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Mic } from "lucide-react";

import { SearchDropdown, VoiceSearchModal } from ".";

import { useDebounce } from "@/hooks/use-debounce";
import { useSearch } from "@/hooks/use-search";
import { VoiceModalResult } from "@/types";

export function SearchInput() {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 500);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: results, isLoading } = useSearch(debouncedQuery);

  // close dropdown khi click ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleVoiceSearch = (result: VoiceModalResult) => {
    setIsModalOpen(false);
    setQuery(result.query);
    setIsDropdownOpen(true);

    setTimeout(() => inputRef.current?.focus(), 220);
  };

  const handleClear = () => {
    setQuery("");
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  return (
    <>
      <VoiceSearchModal
        isOpen={isModalOpen}
        onSearch={handleVoiceSearch}
        onClose={() => setIsModalOpen(false)}
      />

      <div ref={containerRef} className="relative w-full max-w-md">
        {/* input */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={handleInputChange}
            placeholder="Bạn muốn phát gì?"
            className="w-full h-12 rounded-full bg-[#242424] hover:bg-[#2a2a2a] border border-transparent pl-12 pr-20 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:bg-[#2a2a2a] focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query.length > 0 && (
              <button
                type="button"
                aria-label="Xóa"
                onClick={handleClear}
                className="flex items-center justify-center w-6 h-6 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={13} />
              </button>
            )}

            <button
              type="button"
              aria-label="Tìm kiếm bằng giọng nói"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <Mic size={17} />
            </button>
          </div>
        </div>

        {/* dropdown */}
        {isDropdownOpen && !isModalOpen && (
          <SearchDropdown
            searchTerm={query}
            results={results?.data}
            isLoading={isLoading && query.trim().length > 0}
            onClose={() => setIsDropdownOpen(false)}
          />
        )}
      </div>
    </>
  );
}
