"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

import { HummingResultCard, IntentBadge, SearchDropdown } from ".";
import { VoiceMicButton } from "@/components/shared/buttons";

import { useDebounce } from "@/hooks/use-debounce";
import { useSearch } from "@/hooks/use-search";
import { GeminiVoiceResult, VoiceResult, VoiceStatus } from "@/types";
import { analyzeVoiceWithGemini } from "@/lib/gemini";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";

export function SearchInput() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle");
  const [voiceHint, setVoiceHint] = useState("");
  const [geminiResult, setGeminiResult] = useState<GeminiVoiceResult | null>(
    null,
  );
  const [showHumming, setShowHumming] = useState(false);

  const debouncedQuery = useDebounce(query, 500);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: results, isLoading } = useSearch(debouncedQuery);

  // ── click outside ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
        setShowHumming(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // ── reset voice state sau N ms ─────────────────────────────────────────────
  const resetVoice = (delayMs = 0) =>
    setTimeout(() => {
      setVoiceHint("");
      setVoiceStatus("idle");
    }, delayMs);

  // ── xử lý kết quả từ Gemini ───────────────────────────────────────────────
  const handleVoiceResult = async ({ audioBlob }: VoiceResult) => {
    if (!GEMINI_API_KEY) {
      setVoiceHint("Thiếu NEXT_PUBLIC_GEMINI_API_KEY");
      resetVoice(3000);
      return;
    }

    // Reset state cũ
    setGeminiResult(null);
    setShowHumming(false);
    setVoiceStatus("analyzing");
    setVoiceHint("Đang phân tích giọng nói...");

    try {
      const result = await analyzeVoiceWithGemini(audioBlob, GEMINI_API_KEY);
      setGeminiResult(result);

      if (result.intent === "humming") {
        // Phase C — show humming card (dù match hay null)
        setShowHumming(true);
        setVoiceHint("");
        setVoiceStatus("done");
        return;
      }

      // Phase B — text search
      if (result.searchQuery.trim()) {
        setQuery(result.searchQuery);
        setIsOpen(true);
        inputRef.current?.focus();
        setVoiceHint("");
        setVoiceStatus("done");
      } else {
        setVoiceHint(`Không hiểu rõ — thử lại nhé!`);
        resetVoice(2500);
      }
    } catch (err) {
      console.error("[VoiceSearch]", err);
      setVoiceHint("Echo gặp lỗi, thử lại nhé!");
      resetVoice(3000);
      setVoiceStatus("error");
    }
  };

  // ── user bấm "Tìm trong app" từ HummingResultCard ─────────────────────────
  const handleHummingSearch = (q: string) => {
    setQuery(q);
    setIsOpen(true);
    setShowHumming(false);
    inputRef.current?.focus();
  };

  // ── clear ──────────────────────────────────────────────────────────────────
  const handleClear = () => {
    setQuery("");
    setVoiceHint("");
    setGeminiResult(null);
    setShowHumming(false);
    setVoiceStatus("idle");
    inputRef.current?.focus();
  };

  const isAnalyzing = voiceStatus === "analyzing";
  const placeholder =
    voiceHint ||
    (geminiResult?.intent === "lyrics"
      ? "Tìm theo lời bài hát..."
      : "Bạn muốn phát gì?");

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* input row */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setVoiceHint("");
          }}
          placeholder={placeholder}
          className="w-full h-12 rounded-full bg-[#242424] hover:bg-[#2a2a2a] border border-transparent px-4 py-2 pl-12 pr-20 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:bg-[#2a2a2a] focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
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
          <VoiceMicButton
            onResult={handleVoiceResult}
            onError={(e) => console.warn("[mic]", e)}
            disabled={isAnalyzing}
            maxDurationMs={10_000}
          />
        </div>
      </div>

      {/* intent badge — hiện sau khi Gemini trả về (trừ humming) */}
      {geminiResult && query && !showHumming && (
        <IntentBadge
          intent={geminiResult.intent}
          confidence={geminiResult.confidence}
        />
      )}

      {/* humming card */}
      {showHumming && geminiResult && (
        <HummingResultCard
          match={geminiResult.hummingMatch}
          onSearch={handleHummingSearch}
          onClose={() => setShowHumming(false)}
        />
      )}

      {/* search dropdown */}
      {isOpen && !showHumming && (
        <SearchDropdown
          searchTerm={query}
          results={results?.data}
          isLoading={(isLoading && query.trim().length > 0) || isAnalyzing}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
