import { create } from "zustand";

export interface PlayerTrack {
  id: string;
  title: string;
  artistNames: string;
  imageUrl: string;
  audioUrl: string;
  albumId: string;
}

interface PlayerState {
  currentTrack: PlayerTrack | null;
  queue: PlayerTrack[];
  originalQueue: PlayerTrack[];
  currentIndex: number; // Vị trí bài hiện tại trong Queue
  isPlaying: boolean;
  volume: number;

  isShuffle: boolean;
  repeatMode: "off" | "all" | "one";
  isQueueVisible: boolean;

  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleQueue: () => void;
  playTrack: (track: PlayerTrack, queue?: PlayerTrack[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  setVolume: (volume: number) => void;
  setQueue: (queue: PlayerTrack[]) => void;
}

const shuffleArray = (array: PlayerTrack[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const usePlayer = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  originalQueue: [],
  currentIndex: -1,
  isPlaying: false,
  volume: 0.8,
  isShuffle: false,
  repeatMode: "off",
  isQueueVisible: false,

  playTrack: (track, newQueue) => {
    const { isShuffle, originalQueue } = get();
    const targetQueue = newQueue || originalQueue;

    if (isShuffle) {
      // Tách các bài còn lại (khác bài đang bấm)
      const otherTracks = targetQueue.filter((t) => t.id !== track.id);
      // Trộn các bài còn lại
      const shuffledOthers = shuffleArray(otherTracks);
      // Ghép bài đang chọn lên đầu, các bài đã trộn theo sau
      const finalQueue = [track, ...shuffledOthers];

      set({
        originalQueue: targetQueue,
        queue: finalQueue,
        currentTrack: track,
        currentIndex: 0, // Luôn luôn là bài đầu tiên trong list mới
        isPlaying: true,
      });
    } else {
      set({
        originalQueue: targetQueue,
        queue: targetQueue,
        currentTrack: track,
        currentIndex: targetQueue.findIndex((t) => t.id === track.id),
        isPlaying: true,
      });
    }
  },

  togglePlay: () => {
    const { currentTrack, isPlaying } = get();
    if (currentTrack) {
      set({ isPlaying: !isPlaying });
    }
  },

  playNext: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return;

    // Nếu đang ở bài cuối cùng, quay lại bài đầu tiên (Loop queue)
    const nextIndex = currentIndex + 1 >= queue.length ? 0 : currentIndex + 1;
    const nextTrack = queue[nextIndex];

    set({
      currentTrack: nextTrack,
      currentIndex: nextIndex,
      isPlaying: true,
    });
  },

  playPrev: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return;

    // Nếu đang ở bài đầu tiên, lùi về bài cuối cùng
    const prevIndex =
      currentIndex - 1 < 0 ? queue.length - 1 : currentIndex - 1;
    const prevTrack = queue[prevIndex];

    set({
      currentTrack: prevTrack,
      currentIndex: prevIndex,
      isPlaying: true,
    });
  },

  setVolume: (volume: number) => set({ volume }),

  setQueue: (queue: PlayerTrack[]) => set({ queue }),

  toggleShuffle: () => {
    const { isShuffle, originalQueue, currentTrack } = get();
    const newShuffleState = !isShuffle;

    if (newShuffleState) {
      if (!currentTrack) {
        set({ isShuffle: true });
        return;
      }

      // Tách riêng bài đang phát ra khỏi mảng gốc
      const otherTracks = originalQueue.filter((t) => t.id !== currentTrack.id);

      // Chỉ trộn những bài còn lại
      const shuffledOthers = shuffleArray(otherTracks);

      // Gắn bài đang phát lên chóp đỉnh (Vị trí 0)
      const newQueue = [currentTrack, ...shuffledOthers];

      set({
        isShuffle: true,
        queue: newQueue,
        currentIndex: 0, // Đưa vị trí hiện tại về 0
      });
    } else {
      const originalIndex = currentTrack
        ? originalQueue.findIndex((t) => t.id === currentTrack.id)
        : -1;
      set({
        isShuffle: false,
        queue: originalQueue,
        currentIndex: originalIndex, // Trả lại vị trí gốc
      });
    }
  },

  toggleRepeat: () => {
    const current = get().repeatMode;
    const next = current === "off" ? "all" : current === "all" ? "one" : "off";
    set({ repeatMode: next });
  },

  toggleQueue: () => set({ isQueueVisible: !get().isQueueVisible }),
}));
