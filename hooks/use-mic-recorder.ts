import { useRef, useEffect, useCallback } from "react";

interface UseMicRecorderOptions {
  maxDurationMs?: number;
  onBlob: (blob: Blob) => void;
  onError: (msg: string) => void;
}

export function useMicRecorder({
  maxDurationMs = 10_000,
  onBlob,
  onError,
}: UseMicRecorderOptions) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const stop = useCallback(() => {
    if (autoStopRef.current) clearTimeout(autoStopRef.current);
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
    }
  }, []);

  const start = useCallback(async () => {
    // check support
    if (!navigator.mediaDevices?.getUserMedia) {
      onError("Trình duyệt không hỗ trợ ghi âm.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        stopStream();
        if (blob.size > 500) {
          onBlob(blob);
        } else {
          onError("Không nhận được giọng nói, thử lại nhé!");
        }
      };

      recorder.start(100);

      autoStopRef.current = setTimeout(() => stop(), maxDurationMs);
    } catch (err) {
      const denied =
        err instanceof DOMException && err.name === "NotAllowedError";
      onError(
        denied
          ? "Cần cấp quyền microphone để dùng tính năng này."
          : "Không thể mở microphone. Kiểm tra lại thiết bị nhé!",
      );
    }
  }, [maxDurationMs, onBlob, onError, stop, stopStream]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      stopStream();
    };
  }, [stop, stopStream]);

  return { start, stop };
}
