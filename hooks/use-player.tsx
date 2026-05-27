import { toast } from "sonner";
import { create } from "zustand";

export interface PlayerTrack {
  id: string;
  title: string;
  lyrics?: string;
  artistNames: string;
  imageUrl: string;
  audioUrl: string;
  albumId: string;
}

interface SkipData {
  count: number;
  startTime: number | null;
}

interface PlayerState {
  currentTrack: PlayerTrack | null;
  queue: PlayerTrack[];
  originalQueue: PlayerTrack[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;

  activeContextId: string | null;

  isShuffle: boolean;
  repeatMode: "off" | "all" | "one";
  isQueueVisible: boolean;

  isAuthenticated: boolean;
  showLoginModal: boolean;
  skipData: SkipData;
  teasingTrack: PlayerTrack | null;

  setTeasingTrack: (track: PlayerTrack | null) => void;
  setIsAuthenticated: (status: boolean) => void;
  setShowLoginModal: (show: boolean) => void;

  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleQueue: () => void;

  playTrack: (
    track: PlayerTrack,
    queue?: PlayerTrack[],
    contextId?: string,
  ) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  setVolume: (volume: number) => void;
  setQueue: (queue: PlayerTrack[]) => void;

  checkCanSkip: () => boolean;

  resetPlayer: () => void;
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
  activeContextId: null,
  isShuffle: false,
  repeatMode: "off",
  isQueueVisible: false,

  isAuthenticated: false,
  showLoginModal: false,
  skipData: { count: 0, startTime: null },
  teasingTrack: null,

  setTeasingTrack: (track) => set({ teasingTrack: track }),
  setIsAuthenticated: (status) => set({ isAuthenticated: status }),
  setShowLoginModal: (show) => set({ showLoginModal: show }),

  checkCanSkip: () => {
    const { skipData } = get();
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    if (!skipData.startTime || now - skipData.startTime > ONE_HOUR) {
      set({ skipData: { count: 1, startTime: now } });
      return true;
    }

    if (skipData.count >= 6) {
      return false;
    }

    set({
      skipData: { count: skipData.count + 1, startTime: skipData.startTime },
    });
    return true;
  },

  playTrack: (track, newQueue, contextId) => {
    const { isAuthenticated } = get();

    if (!isAuthenticated) {
      set({ showLoginModal: true, teasingTrack: track });
      return;
    }

    const {
      isShuffle,
      originalQueue,
      activeContextId: currentContextId,
    } = get();
    const targetQueue = newQueue || originalQueue;

    const nextContextId =
      contextId !== undefined ? contextId : currentContextId;

    if (isShuffle) {
      const otherTracks = targetQueue.filter((t) => t.id !== track.id);
      const shuffledOthers = shuffleArray(otherTracks);
      const finalQueue = [track, ...shuffledOthers];

      set({
        originalQueue: targetQueue,
        queue: finalQueue,
        currentTrack: track,
        currentIndex: 0,
        isPlaying: true,
        activeContextId: nextContextId,
      });
    } else {
      set({
        originalQueue: targetQueue,
        queue: targetQueue,
        currentTrack: track,
        currentIndex: targetQueue.findIndex((t) => t.id === track.id),
        isPlaying: true,
        activeContextId: nextContextId,
      });
    }
  },

  togglePlay: () => {
    const { currentTrack, isPlaying, isAuthenticated } = get();

    if (!isAuthenticated) {
      set({ showLoginModal: true });
      return;
    }

    if (currentTrack) {
      set({ isPlaying: !isPlaying });
    }
  },

  playNext: () => {
    const { queue, currentIndex, isAuthenticated, checkCanSkip } = get();

    if (!isAuthenticated) {
      set({ showLoginModal: true });
      return;
    }

    if (queue.length === 0) return;

    if (!checkCanSkip()) {
      toast.warning("Đã đạt giới hạn 6 lần chuyển bài trong 1 giờ.");
      return;
    }

    const nextIndex = currentIndex + 1 >= queue.length ? 0 : currentIndex + 1;
    const nextTrack = queue[nextIndex];

    set({
      currentTrack: nextTrack,
      currentIndex: nextIndex,
      isPlaying: true,
    });
  },

  playPrev: () => {
    const { queue, currentIndex, isAuthenticated, checkCanSkip } = get();

    if (!isAuthenticated) {
      set({ showLoginModal: true });
      return;
    }

    if (queue.length === 0) return;

    if (!checkCanSkip()) {
      console.warn("Đã đạt giới hạn 6 lần chuyển bài trong 1 giờ.");
      return;
    }

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

      const otherTracks = originalQueue.filter((t) => t.id !== currentTrack.id);
      const shuffledOthers = shuffleArray(otherTracks);
      const newQueue = [currentTrack, ...shuffledOthers];

      set({
        isShuffle: true,
        queue: newQueue,
        currentIndex: 0,
      });
    } else {
      const originalIndex = currentTrack
        ? originalQueue.findIndex((t) => t.id === currentTrack.id)
        : -1;
      set({
        isShuffle: false,
        queue: originalQueue,
        currentIndex: originalIndex,
      });
    }
  },

  toggleRepeat: () => {
    const current = get().repeatMode;
    const next = current === "off" ? "all" : current === "all" ? "one" : "off";
    set({ repeatMode: next });
  },

  toggleQueue: () => set({ isQueueVisible: !get().isQueueVisible }),

  resetPlayer: () => {
    set({
      currentTrack: null,
      queue: [],
      originalQueue: [],
      currentIndex: -1,
      isPlaying: false,
      activeContextId: null,
      teasingTrack: null,
    });
  },
}));
