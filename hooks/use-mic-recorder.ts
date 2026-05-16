import { useRef, useEffect, useCallback } from "react";
import { getBestMimeType } from "@/lib/utils/audio";

const MIN_BLOB_SIZE_BYTES = 500;

interface Options {
  maxDurationMs?: number;
  onBlob: (blob: Blob) => void;
  onError: (message: string) => void;
}

export function useMicRecorder({
  maxDurationMs = 10_000,
  onBlob,
  onError,
}: Options) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mimeTypeRef = useRef<string>("");

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const stop = useCallback(() => {
    if (autoStopRef.current) clearTimeout(autoStopRef.current);
    if (recorderRef.current?.state !== "inactive") {
      recorderRef.current?.stop();
    }
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      onError("Your browser does not support audio recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = getBestMimeType();
      mimeTypeRef.current = mimeType;

      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current });
        releaseStream();

        if (blob.size < MIN_BLOB_SIZE_BYTES) {
          onError("Không nhận được giọng nói, thử lại nhé!");
          return;
        }
        onBlob(blob);
      };

      recorder.start(100);
      autoStopRef.current = setTimeout(stop, maxDurationMs);
    } catch (err) {
      const isDenied =
        err instanceof DOMException && err.name === "NotAllowedError";
      onError(
        isDenied
          ? "Cần cấp quyền microphone để dùng tính năng này."
          : "Không thể mở microphone. Kiểm tra lại thiết bị nhé!",
      );
    }
  }, [maxDurationMs, onBlob, onError, stop, releaseStream]);

  useEffect(() => {
    return () => {
      stop();
      releaseStream();
    };
  }, [stop, releaseStream]);

  return { start, stop };
}
