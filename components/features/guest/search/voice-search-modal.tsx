"use client";

import { useEffect, useCallback, useState } from "react";
import { Search, Mic, AlertCircle, Music2, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WaveformBars } from "./waveform-bars";

import { useMicRecorder } from "@/hooks/use-mic-recorder";
import { getNormalizedMimeType } from "@/lib/utils/audio";
import { confidenceColorClass, formatConfidence } from "@/lib/utils/confidence";
import { INTENT_LABELS } from "@/constants/search";
import type {
  VoiceAnalysisResult,
  VoicePhase,
  VoiceSearchPayload,
} from "@/types/search";

interface Props {
  isOpen: boolean;
  onSearch: (payload: VoiceSearchPayload) => void;
  onClose: () => void;
}

export function VoiceSearchModal({ isOpen, onSearch, onClose }: Props) {
  const [phase, setPhase] = useState<VoicePhase>("listening");
  const [transcript, setTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<VoiceAnalysisResult | null>(null);

  const handleBlob = useCallback(async (blob: Blob) => {
    setPhase("processing");
    try {
      const res = await fetch("/api/voice/analyze", {
        method: "POST",
        headers: { "Content-Type": getNormalizedMimeType(blob) },
        body: blob,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Error ${res.status}`);
      }

      const data: VoiceAnalysisResult = await res.json();
      setResult(data);
      setTranscript(data.transcript === "[humming]" ? "" : data.transcript);
      setPhase("result");
    } catch (err) {
      console.error("[VoiceModal]", err);
      setErrorMsg("Voice analysis failed. Please try again.");
      setPhase("error");
    }
  }, []);

  const recorder = useMicRecorder({
    maxDurationMs: 10_000,
    onBlob: handleBlob,
    onError: (msg) => {
      setErrorMsg(msg);
      setPhase("error");
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    setPhase("listening");
    setTranscript("");
    setErrorMsg("");
    setResult(null);
    recorder.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleRetry = () => {
    setPhase("listening");
    setTranscript("");
    setErrorMsg("");
    setResult(null);
    recorder.start();
  };

  const handleSearch = () => {
    if (!result) return;

    const query =
      result.intent === "humming" && result.hummingMatch
        ? `${result.hummingMatch.title} ${result.hummingMatch.artist}`
        : result.searchQuery;

    if (!query.trim()) return;
    onSearch({ query, intent: result.intent });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      recorder.stop();
      onClose();
    }
  };

  const isHumming = result?.intent === "humming";
  const hummingFound = isHumming && !!result?.hummingMatch;
  const canSearch =
    phase === "result" &&
    ((isHumming && hummingFound) ||
      (!isHumming && !!result?.searchQuery?.trim()));

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[min(440px,calc(100vw-32px))] bg-card border-border rounded-2xl px-7 pt-8 pb-7 shadow-2xl [&>button]:text-muted-foreground [&>button]:hover:text-foreground">
        <DialogHeader className="sr-only">
          <DialogTitle>Tìm kiếm bằng giọng nói</DialogTitle>
        </DialogHeader>

        {/* LISTENING */}
        {phase === "listening" && (
          <div className="flex flex-col items-center gap-5">
            <button
              onClick={() => recorder.stop()}
              aria-label="Stop recording"
              className="relative flex items-center justify-center w-20 h-20 rounded-full bg-primary/15 border-2 border-primary/50 hover:bg-primary/20 hover:scale-105 transition-all"
            >
              <Mic size={28} className="text-primary" />
              <span className="absolute inset-[-8px] rounded-full border border-primary/30 animate-ping" />
              <span className="absolute inset-[-16px] rounded-full border border-primary/20 animate-ping [animation-delay:500ms]" />
            </button>
            <WaveformBars active={true} />
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">
                Đang nghe... bấm để dừng
              </p>
              <p className="text-xs text-muted-foreground">
                Nói tên bài, ca sĩ, lời nhạc hoặc ngân nga
              </p>
            </div>
          </div>
        )}

        {/* PROCESSING */}
        {phase === "processing" && (
          <div className="flex flex-col items-center gap-5">
            <div className="relative flex items-center justify-center w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-border border-t-primary animate-spin" />
              <Mic size={20} className="text-muted-foreground" />
            </div>
            <WaveformBars active={false} />
            <p className="text-sm font-medium text-muted-foreground">
              Đang phân tích...
            </p>
          </div>
        )}

        {/* RESULT */}
        {phase === "result" && result && (
          <div className="flex flex-col items-center gap-4">
            <span className="text-xs font-medium text-muted-foreground bg-background/50 border border-border rounded-full px-3 py-1">
              {INTENT_LABELS[result.intent]}
            </span>

            {!isHumming && transcript && (
              <p className="text-lg font-semibold text-foreground text-center leading-snug max-w-xs">
                &ldquo;{transcript}&rdquo;
              </p>
            )}

            {!isHumming &&
              result.searchQuery &&
              result.searchQuery !== transcript && (
                <p className="text-xs text-muted-foreground">
                  Tìm:{" "}
                  <span className="text-foreground font-medium">
                    {result.searchQuery}
                  </span>
                </p>
              )}

            {isHumming && hummingFound && (
              <div className="w-full flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
                <Music2 size={18} className="text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {result.hummingMatch!.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {result.hummingMatch!.artist}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold shrink-0 ${confidenceColorClass(result.hummingMatch!.confidence)}`}
                >
                  {formatConfidence(result.hummingMatch!.confidence)}
                </span>
              </div>
            )}

            {isHumming && !hummingFound && (
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Không nhận ra giai điệu
                </p>
                <p className="text-xs text-muted-foreground/80">
                  Thử ngân nga rõ hơn hoặc lâu hơn nhé!
                </p>
              </div>
            )}

            {result.confidence < 0.55 && (
              <div className="flex items-center gap-2 text-xs text-yellow-500">
                <AlertCircle size={13} />
                <span>Độ chính xác thấp — thử nói lại rõ hơn nếu sai</span>
              </div>
            )}

            <div className="flex items-center gap-3 mt-1">
              <button
                onClick={handleRetry}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-background hover:bg-border/50 border border-border rounded-full px-4 py-2 transition-colors"
              >
                <RotateCcw size={13} /> Nói lại
              </button>
              {canSearch && (
                <button
                  onClick={handleSearch}
                  className="flex items-center gap-2 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.98] rounded-full px-5 py-2 transition-all"
                >
                  <Search size={13} /> Tìm kiếm
                </button>
              )}
            </div>
          </div>
        )}

        {/* ERROR */}
        {phase === "error" && (
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 border-2 border-destructive/30 text-destructive">
              <Mic size={26} />
            </div>
            <p className="text-sm font-medium text-destructive text-center">
              {errorMsg}
            </p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-background hover:bg-border/50 border border-border rounded-full px-5 py-2 transition-colors"
            >
              <RotateCcw size={13} /> Thử lại
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
