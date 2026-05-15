"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";

import { VoiceResult, VoiceState } from "@/types/voice.type";

interface VoiceMicButtonProps {
  onResult: (result: VoiceResult) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  maxDurationMs?: number;
}

function WaveformBars() {
  return (
    <span className="voice-waveform" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="voice-bar"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </span>
  );
}

export function VoiceMicButton({
  onResult,
  onError,
  disabled = false,
  maxDurationMs = 10_000,
}: VoiceMicButtonProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [elapsedMs, setElapsedMs] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []);

  const stopAll = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoStopRef.current) clearTimeout(autoStopRef.current);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    timerRef.current = null;
    autoStopRef.current = null;
  }, []);

  const handleStop = useCallback(() => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.state === "inactive"
    ) {
      setVoiceState("idle");
      return;
    }

    setVoiceState("processing");

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(chunksRef.current, {
        type: mediaRecorderRef.current?.mimeType || "audio/webm",
      });
      const audioDurationMs = Date.now() - startTimeRef.current;

      stopAll();
      setElapsedMs(0);

      if (audioBlob.size < 1000) {
        setVoiceState("error");
        const msg = "Không nhận được giọng nói. Thử lại nhé!";
        setErrorMsg(msg);
        onError?.(msg);
        setTimeout(() => setVoiceState("idle"), 2500);
        return;
      }

      setVoiceState("idle");
      onResult({ audioBlob, audioDurationMs });
    };

    mediaRecorderRef.current.stop();
  }, [onError, onResult, stopAll]);

  const handleStart = useCallback(async () => {
    setErrorMsg("");

    if (!navigator.mediaDevices?.getUserMedia) {
      const msg = "Trình duyệt không hỗ trợ ghi âm.";
      setErrorMsg(msg);
      setVoiceState("error");
      onError?.(msg);
      setTimeout(() => setVoiceState("idle"), 2500);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start(100);
      startTimeRef.current = Date.now();
      setVoiceState("listening");
      setElapsedMs(0);

      timerRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startTimeRef.current);
      }, 100);

      autoStopRef.current = setTimeout(() => {
        handleStop();
      }, maxDurationMs);
    } catch (err) {
      const isPermission =
        err instanceof DOMException && err.name === "NotAllowedError";
      const msg = isPermission
        ? "Cần cấp quyền microphone để dùng tính năng này."
        : "Không thể mở microphone. Kiểm tra lại thiết bị nhé!";
      setErrorMsg(msg);
      setVoiceState("error");
      onError?.(msg);
      setTimeout(() => setVoiceState("idle"), 3000);
    }
  }, [handleStop, maxDurationMs, onError]);

  const handleClick = () => {
    if (disabled) return;
    if (voiceState === "listening") {
      handleStop();
    } else if (voiceState === "idle") {
      handleStart();
    }
  };

  const formatElapsed = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${s}s`;
  };

  const progressPct = Math.min((elapsedMs / maxDurationMs) * 100, 100);

  return (
    <>
      <style>{`
        .voice-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background: transparent;
          color: #9ca3af;
          transition: color 0.2s, background 0.2s, transform 0.15s;
          flex-shrink: 0;
        }
        .voice-btn:hover:not(:disabled) {
          color: #ffffff;
          background: rgba(255,255,255,0.08);
        }
        .voice-btn:active:not(:disabled) {
          transform: scale(0.93);
        }
        .voice-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .voice-btn.listening {
          color: #ef4444;
          background: rgba(239,68,68,0.12);
          animation: voice-pulse 1.6s ease-in-out infinite;
        }
        .voice-btn.processing {
          color: #6b7280;
          cursor: default;
        }
        .voice-btn.error {
          color: #f87171;
        }

        /* ring progress khi đang listening */
        .voice-ring {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          pointer-events: none;
        }
        .voice-ring circle {
          transition: stroke-dashoffset 0.1s linear;
        }

        @keyframes voice-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3); }
          50%       { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
        }

        /* waveform bars */
        .voice-waveform {
          display: flex;
          align-items: center;
          gap: 2px;
          height: 14px;
        }
        .voice-bar {
          display: block;
          width: 2px;
          border-radius: 1px;
          background: #ef4444;
          animation: voice-bar-bounce 0.8s ease-in-out infinite alternate;
          height: 4px;
        }
        .voice-bar:nth-child(1) { animation-duration: 0.7s; }
        .voice-bar:nth-child(2) { animation-duration: 0.85s; }
        .voice-bar:nth-child(3) { animation-duration: 0.65s; }
        .voice-bar:nth-child(4) { animation-duration: 0.9s; }
        .voice-bar:nth-child(5) { animation-duration: 0.75s; }

        @keyframes voice-bar-bounce {
          from { height: 3px; opacity: 0.6; }
          to   { height: 14px; opacity: 1; }
        }

        /* tooltip / status badge */
        .voice-badge {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 999px;
          pointer-events: none;
          z-index: 50;
        }
        .voice-badge.listening {
          background: rgba(239,68,68,0.15);
          color: #fca5a5;
          border: 0.5px solid rgba(239,68,68,0.3);
        }
        .voice-badge.error {
          background: rgba(239,68,68,0.12);
          color: #fca5a5;
          border: 0.5px solid rgba(239,68,68,0.25);
          font-size: 11px;
          white-space: normal;
          max-width: 200px;
          text-align: center;
          bottom: calc(100% + 10px);
        }
      `}</style>

      <div style={{ position: "relative", display: "inline-flex" }}>
        <button
          type="button"
          aria-label={
            voiceState === "listening"
              ? "Dừng ghi âm"
              : voiceState === "processing"
                ? "Đang xử lý..."
                : "Tìm kiếm bằng giọng nói"
          }
          className={`voice-btn ${voiceState}`}
          onClick={handleClick}
          disabled={disabled || voiceState === "processing"}
        >
          {/* progress ring */}
          {voiceState === "listening" && (
            <svg
              className="voice-ring"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="21"
                cy="21"
                r="19"
                stroke="rgba(239,68,68,0.15)"
                strokeWidth="1.5"
              />
              <circle
                cx="21"
                cy="21"
                r="19"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 19}`}
                strokeDashoffset={`${2 * Math.PI * 19 * (1 - progressPct / 100)}`}
                transform="rotate(-90 21 21)"
              />
            </svg>
          )}

          {/* icon / waveform */}
          {voiceState === "idle" && <Mic size={17} />}
          {voiceState === "listening" && <WaveformBars />}
          {voiceState === "processing" && (
            <Loader2 size={17} className="animate-spin" />
          )}
          {voiceState === "error" && <MicOff size={17} />}
        </button>

        {/* status badge */}
        {voiceState === "listening" && (
          <span className="voice-badge listening">
            {formatElapsed(elapsedMs)} / {formatElapsed(maxDurationMs)}
          </span>
        )}
        {voiceState === "error" && errorMsg && (
          <span className="voice-badge error">{errorMsg}</span>
        )}
      </div>
    </>
  );
}
