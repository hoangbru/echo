"use client";

import { Track } from "@/types";
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
  useRef,
  useEffect,
} from "react";

export type RepeatMode = "off" | "all" | "one";

export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  unshuffledQueue: Track[]; // Lưu trữ danh sách gốc để khôi phục khi tắt Shuffle
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  repeat: RepeatMode;
  shuffle: boolean;
  currentIndex: number;
}

// ... (Khai báo PlayerContextType và PlayerAction giữ nguyên như cũ, tôi rút gọn ở đây để bạn dễ nhìn)
export interface PlayerContextType {
  state: PlayerState;
  play: (track: Track, tracks?: Track[]) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setRepeat: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
  seek: (time: number) => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  setCurrentTime: (time: number) => void;
}

type PlayerAction =
  | { type: "PLAY"; payload: { track: Track; queue?: Track[] } }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "NEXT" }
  | { type: "PREVIOUS" }
  | { type: "SET_VOLUME"; payload: number }
  | { type: "TOGGLE_MUTE" }
  | { type: "SET_REPEAT"; payload: RepeatMode }
  | { type: "TOGGLE_SHUFFLE" }
  | { type: "SEEK"; payload: number }
  | { type: "SET_QUEUE"; payload: Track[] }
  | { type: "ADD_TO_QUEUE"; payload: Track }
  | { type: "REMOVE_FROM_QUEUE"; payload: number }
  | { type: "CLEAR_QUEUE" }
  | { type: "SET_CURRENT_TIME"; payload: number };

const initialState: PlayerState = {
  currentTrack: null,
  queue: [],
  unshuffledQueue: [], // Khởi tạo mảng gốc
  isPlaying: false,
  currentTime: 0,
  volume: 1,
  isMuted: false,
  repeat: "off",
  shuffle: false,
  currentIndex: -1,
};

// Thuật toán Fisher-Yates Shuffle
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case "PLAY": {
      const originalQueue = action.payload.queue || [action.payload.track];
      let newQueue = [...originalQueue];
      let newIndex = newQueue.findIndex(
        (t) => t.id === action.payload.track.id,
      );
      if (newIndex === -1) newIndex = 0;

      // Nếu đang bật Shuffle, trộn danh sách mới ngay lập tức
      if (state.shuffle) {
        const queueWithoutCurrent = newQueue.filter((_, i) => i !== newIndex);
        const shuffled = shuffleArray(queueWithoutCurrent);
        newQueue = [newQueue[newIndex], ...shuffled]; // Đưa bài hát được chọn lên đầu mảng
        newIndex = 0;
      }

      return {
        ...state,
        currentTrack: action.payload.track,
        queue: newQueue,
        unshuffledQueue: originalQueue,
        currentIndex: newIndex,
        isPlaying: true,
        currentTime: 0,
      };
    }
    case "TOGGLE_SHUFFLE": {
      const newShuffle = !state.shuffle;
      let newQueue = state.queue;
      let newIndex = state.currentIndex;

      if (newShuffle) {
        // Bật Shuffle: Trộn mảng nhưng giữ nguyên bài đang phát ở index 0
        const currentTrack = state.queue[state.currentIndex];
        const queueWithoutCurrent = state.queue.filter(
          (_, i) => i !== state.currentIndex,
        );
        const shuffled = shuffleArray(queueWithoutCurrent);

        newQueue = currentTrack ? [currentTrack, ...shuffled] : shuffled;
        newIndex = currentTrack ? 0 : -1;
      } else {
        // Tắt Shuffle: Khôi phục mảng gốc, tìm lại vị trí index của bài đang phát
        newQueue =
          state.unshuffledQueue.length > 0
            ? [...state.unshuffledQueue]
            : state.queue;
        const currentTrack = state.queue[state.currentIndex];
        newIndex = newQueue.findIndex((t) => t.id === currentTrack?.id);
        if (newIndex === -1) newIndex = 0;
      }

      return {
        ...state,
        shuffle: newShuffle,
        queue: newQueue,
        currentIndex: newIndex,
      };
    }
    case "NEXT": {
      let nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.queue.length) {
        if (state.repeat === "all") nextIndex = 0;
        else return state; // Dừng lại nếu hết danh sách và không lặp
      }
      return {
        ...state,
        currentIndex: nextIndex,
        currentTrack: state.queue[nextIndex],
        currentTime: 0,
      };
    }
    case "PREVIOUS": {
      if (state.currentTime > 3) return { ...state, currentTime: 0 }; // Tua lại từ đầu nếu đã nghe hơn 3s
      let prevIndex = state.currentIndex - 1;
      if (prevIndex < 0) prevIndex = state.queue.length - 1;
      return {
        ...state,
        currentIndex: prevIndex,
        currentTrack: state.queue[prevIndex],
        currentTime: 0,
      };
    }
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "RESUME":
      return { ...state, isPlaying: true };
    case "SET_VOLUME":
      return { ...state, volume: Math.min(1, Math.max(0, action.payload)) };
    case "TOGGLE_MUTE":
      return { ...state, isMuted: !state.isMuted };
    case "SET_REPEAT":
      return { ...state, repeat: action.payload };
    case "SEEK":
      return { ...state, currentTime: action.payload };
    case "SET_CURRENT_TIME":
      return { ...state, currentTime: action.payload };
    // Các case khác giữ nguyên...
    default:
      return state;
  }
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Đồng bộ Trạng thái Play/Pause với Thẻ Audio
  useEffect(() => {
    if (!audioRef.current) return;
    if (state.isPlaying && audioRef.current.paused) {
      audioRef.current
        .play()
        .catch((error) => console.error("Auto-play prevented:", error));
    } else if (!state.isPlaying && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [state.isPlaying, state.currentTrack]); // Lắng nghe thêm currentTrack để tự động play bài mới

  // 2. Đồng bộ Âm lượng (Volume & Mute)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
      audioRef.current.muted = state.isMuted;
    }
  }, [state.volume, state.isMuted]);

  // ================= Tích hợp các hàm Dispatch =================
  const play = useCallback(
    (track: Track, queue?: Track[]) =>
      dispatch({ type: "PLAY", payload: { track, queue } }),
    [],
  );
  const pause = useCallback(() => dispatch({ type: "PAUSE" }), []);
  const resume = useCallback(() => dispatch({ type: "RESUME" }), []);
  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const previous = useCallback(() => dispatch({ type: "PREVIOUS" }), []);
  const setVolume = useCallback(
    (volume: number) => dispatch({ type: "SET_VOLUME", payload: volume }),
    [],
  );
  const toggleMute = useCallback(() => dispatch({ type: "TOGGLE_MUTE" }), []);
  const setRepeat = useCallback(
    (mode: RepeatMode) => dispatch({ type: "SET_REPEAT", payload: mode }),
    [],
  );
  const toggleShuffle = useCallback(
    () => dispatch({ type: "TOGGLE_SHUFFLE" }),
    [],
  );
  const setQueue = useCallback(
    (tracks: Track[]) => dispatch({ type: "SET_QUEUE", payload: tracks }),
    [],
  );
  const addToQueue = useCallback(
    (track: Track) => dispatch({ type: "ADD_TO_QUEUE", payload: track }),
    [],
  );
  const removeFromQueue = useCallback(
    (index: number) => dispatch({ type: "REMOVE_FROM_QUEUE", payload: index }),
    [],
  );
  const clearQueue = useCallback(() => dispatch({ type: "CLEAR_QUEUE" }), []);

  // Hàm seek gọi thẳng xuống thẻ Audio để nhạc tua tức thì mà không giật cục
  const seek = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
    dispatch({ type: "SEEK", payload: time });
  }, []);
  const setCurrentTime = useCallback(
    (time: number) => dispatch({ type: "SET_CURRENT_TIME", payload: time }),
    [],
  );

  // ================= Xử lý Sự kiện của thẻ <audio> =================
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    if (state.repeat === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
    } else {
      next(); // Tự động chuyển bài (Hàm NEXT đã tự xử lý logic Repeat All hoặc End)
    }
  };

  const value: PlayerContextType = {
    state,
    play,
    pause,
    resume,
    next,
    previous,
    setVolume,
    toggleMute,
    setRepeat,
    toggleShuffle,
    seek,
    setQueue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    setCurrentTime,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {/* THẺ AUDIO ẨN LÀ TRÁI TIM CỦA HỆ THỐNG
        Được thiết kế declarative, tự động cập nhật src dựa vào Context. 
      */}
      <audio
        ref={audioRef}
        src={state.currentTrack?.audio_url || ""}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => {
          if (!state.isPlaying) resume();
        }} // Đồng bộ khi user thao tác bằng nút cứng trên máy tính
        onPause={() => {
          if (state.isPlaying) pause();
        }}
        crossOrigin="anonymous"
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
