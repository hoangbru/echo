"use client";

import { useEffect, useCallback, useState } from "react";
import { Search, Mic, AlertCircle, Music2, RotateCcw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useMicRecorder } from "@/hooks/use-mic-recorder";
import { analyzeVoiceWithGemini } from "@/lib/gemini";
import { GeminiVoiceResult, ModalPhase, VoiceModalResult } from "@/types";
import { WaveformBars } from "./waveform-bars";
import { INTENT_LABELS } from "@/constants/voice-prompt";
import { confidenceColor, confidencePct } from "@/lib/utils/voice-helpers";

interface VoiceSearchModalProps {
  isOpen: boolean;
  onSearch: (result: VoiceModalResult) => void;
  onClose: () => void;
}

export function VoiceSearchModal({
  isOpen,
  onSearch,
  onClose,
}: VoiceSearchModalProps) {
  const [phase, setPhase] = useState<ModalPhase>("listening");
  const [transcript, setTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [geminiRes, setGeminiRes] = useState<GeminiVoiceResult | null>(null);

  const handleBlob = useCallback(async (blob: Blob) => {
    setPhase("processing");
    try {
      const result = await analyzeVoiceWithGemini(blob);
      setGeminiRes(result);
      setTranscript(result.transcript === "[humming]" ? "" : result.transcript);
      setPhase("result");
    } catch (err) {
      console.error("[VoiceModal]", err);
      setErrorMsg("Echo Assistant gặp lỗi, thử lại nhé!");
      setPhase("error");
    }
  }, []);

  const handleMicError = useCallback((msg: string) => {
    setErrorMsg(msg);
    setPhase("error");
  }, []);

  const recorder = useMicRecorder({
    maxDurationMs: 10_000,
    onBlob: handleBlob,
    onError: handleMicError,
  });

  useEffect(() => {
    if (!isOpen) return;
    setPhase("listening");
    setTranscript("");
    setErrorMsg("");
    setGeminiRes(null);
    recorder.start();
  }, [isOpen]);

  const handleRetry = () => {
    setPhase("listening");
    setTranscript("");
    setErrorMsg("");
    setGeminiRes(null);
    recorder.start();
  };

  const handleSearch = () => {
    if (!geminiRes) return;
    const query =
      geminiRes.intent === "humming" && geminiRes.hummingMatch
        ? `${geminiRes.hummingMatch.title} ${geminiRes.hummingMatch.artist}`
        : geminiRes.searchQuery;
    if (!query.trim()) return;
    onSearch({ query, geminiResult: geminiRes });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      recorder.stop();
      onClose();
    }
  };

  const isHumming = geminiRes?.intent === "humming";
  const hummingFound = isHumming && !!geminiRes?.hummingMatch;
  const canSearch =
    phase === "result" &&
    ((isHumming && hummingFound) ||
      (!isHumming && !!geminiRes?.searchQuery?.trim()));

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[min(440px,calc(100vw-32px))] bg-[#161616] border-white/10 rounded-2xl px-7 pt-8 pb-7 shadow-2xl [&>button]:text-gray-400 [&>button]:hover:text-white">
        <DialogHeader className="sr-only">
          <DialogTitle>Tìm kiếm bằng giọng nói</DialogTitle>
        </DialogHeader>

        {/* ── LISTENING ─────────────────────────────────────────────── */}
        {phase === "listening" && (
          <div className="flex flex-col items-center gap-5">
            <button
              onClick={() => recorder.stop()}
              aria-label="Dừng ghi âm"
              className="relative flex items-center justify-center w-20 h-20 rounded-full bg-red-500/15 border-2 border-red-500/50 hover:bg-red-500/22 hover:scale-105 transition-all cursor-pointer"
            >
              <Mic size={28} className="text-red-400" />
              <span className="absolute inset-[-8px] rounded-full border border-red-500/30 animate-ping" />
              <span className="absolute inset-[-16px] rounded-full border border-red-500/20 animate-ping [animation-delay:500ms]" />
            </button>

            <WaveformBars active={true} />

            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-gray-200">
                Đang nghe... bấm để dừng
              </p>
              <p className="text-xs text-gray-500">
                Nói tên bài, ca sĩ, lời nhạc hoặc ngân nga
              </p>
            </div>
          </div>
        )}

        {/* ── PROCESSING ────────────────────────────────────────────── */}
        {phase === "processing" && (
          <div className="flex flex-col items-center gap-5">
            <div className="relative flex items-center justify-center w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-white/8 border-t-red-500 animate-spin" />
              <Mic size={20} className="text-gray-400" />
            </div>

            <WaveformBars active={false} />

            <p className="text-sm font-medium text-gray-300">
              Đang phân tích giọng nói...
            </p>

            {transcript && (
              <p className="text-base font-semibold text-white text-center animate-in fade-in">
                &ldquo;{transcript}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* ── RESULT ────────────────────────────────────────────────── */}
        {phase === "result" && geminiRes && (
          <div className="flex flex-col items-center gap-4">
            <span className="text-xs font-medium text-gray-400 bg-white/6 border border-white/10 rounded-full px-3 py-1 tracking-wide">
              {INTENT_LABELS[geminiRes.intent] ?? INTENT_LABELS.unknown}
            </span>

            {!isHumming && transcript && (
              <p className="text-lg font-semibold text-white text-center leading-snug max-w-xs animate-in fade-in">
                &ldquo;{transcript}&rdquo;
              </p>
            )}

            {!isHumming &&
              geminiRes.searchQuery &&
              geminiRes.searchQuery !== transcript && (
                <p className="text-xs text-gray-500">
                  Tìm:{" "}
                  <span className="text-gray-300 font-medium">
                    {geminiRes.searchQuery}
                  </span>
                </p>
              )}

            {isHumming && hummingFound && (
              <div className="w-full flex items-center gap-3 bg-green-500/8 border border-green-500/20 rounded-xl px-4 py-3 animate-in fade-in">
                <Music2 size={18} className="text-green-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {geminiRes.hummingMatch!.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {geminiRes.hummingMatch!.artist}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold shrink-0 ${confidenceColor(geminiRes.hummingMatch!.confidence)}`}
                >
                  {confidencePct(geminiRes.hummingMatch!.confidence)}
                </span>
              </div>
            )}

            {isHumming && !hummingFound && (
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-gray-400">
                  Không nhận ra giai điệu
                </p>
                <p className="text-xs text-gray-600">
                  Thử ngân nga rõ hơn hoặc lâu hơn nhé!
                </p>
              </div>
            )}

            {geminiRes.confidence < 0.55 && (
              <div className="flex items-center gap-2 text-xs text-yellow-400">
                <AlertCircle size={13} />
                <span>Độ chính xác thấp — thử nói lại rõ hơn nếu sai</span>
              </div>
            )}

            <div className="flex items-center gap-3 mt-1">
              <button
                onClick={handleRetry}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white bg-white/6 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 transition-colors"
              >
                <RotateCcw size={13} />
                Nói lại
              </button>

              {canSearch && (
                <button
                  onClick={handleSearch}
                  className="flex items-center gap-2 text-xs font-semibold text-black bg-white hover:opacity-90 rounded-full px-5 py-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search size={13} />
                  Tìm kiếm
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── ERROR ─────────────────────────────────────────────────── */}
        {phase === "error" && (
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 text-red-400">
              <Mic size={26} />
            </div>

            <p className="text-sm font-medium text-red-300 text-center">
              {errorMsg}
            </p>

            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white bg-white/6 hover:bg-white/10 border border-white/10 rounded-full px-5 py-2 transition-colors"
            >
              <RotateCcw size={13} />
              Thử lại
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
