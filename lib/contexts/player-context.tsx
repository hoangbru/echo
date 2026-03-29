'use client'

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'

export type RepeatMode = 'off' | 'all' | 'one'

export interface Track {
  id: string
  title: string
  artist: string
  artistId: string
  album?: string
  albumId?: string
  duration: number
  audioUrl: string
  coverImage?: string
  rating?: number
  isExplicit?: boolean
}

export interface PlayerState {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  currentTime: number
  volume: number
  isMuted: boolean
  repeat: RepeatMode
  shuffle: boolean
  currentIndex: number
}

export interface PlayerContextType {
  state: PlayerState
  play: (track: Track, tracks?: Track[]) => void
  pause: () => void
  resume: () => void
  next: () => void
  previous: () => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  setRepeat: (mode: RepeatMode) => void
  toggleShuffle: () => void
  seek: (time: number) => void
  setQueue: (tracks: Track[]) => void
  addToQueue: (track: Track) => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void
  setCurrentTime: (time: number) => void
}

type PlayerAction =
  | { type: 'PLAY'; payload: { track: Track; queue?: Track[] } }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'NEXT' }
  | { type: 'PREVIOUS' }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'SET_REPEAT'; payload: RepeatMode }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'SEEK'; payload: number }
  | { type: 'SET_QUEUE'; payload: Track[] }
  | { type: 'ADD_TO_QUEUE'; payload: Track }
  | { type: 'REMOVE_FROM_QUEUE'; payload: number }
  | { type: 'CLEAR_QUEUE' }
  | { type: 'SET_CURRENT_TIME'; payload: number }

const initialState: PlayerState = {
  currentTrack: null,
  queue: [],
  isPlaying: false,
  currentTime: 0,
  volume: 1,
  isMuted: false,
  repeat: 'off',
  shuffle: false,
  currentIndex: -1,
}

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'PLAY': {
      const newQueue = action.payload.queue || [action.payload.track]
      return {
        ...state,
        currentTrack: action.payload.track,
        queue: newQueue,
        currentIndex: 0,
        isPlaying: true,
        currentTime: 0,
      }
    }
    case 'PAUSE':
      return { ...state, isPlaying: false }
    case 'RESUME':
      return { ...state, isPlaying: true }
    case 'NEXT': {
      let nextIndex = state.currentIndex + 1
      if (nextIndex >= state.queue.length) {
        if (state.repeat === 'all') {
          nextIndex = 0
        } else {
          return state
        }
      }
      return {
        ...state,
        currentIndex: nextIndex,
        currentTrack: state.queue[nextIndex],
        currentTime: 0,
      }
    }
    case 'PREVIOUS': {
      if (state.currentTime > 3) {
        return { ...state, currentTime: 0 }
      }
      let prevIndex = state.currentIndex - 1
      if (prevIndex < 0) {
        prevIndex = state.queue.length - 1
      }
      return {
        ...state,
        currentIndex: prevIndex,
        currentTrack: state.queue[prevIndex],
        currentTime: 0,
      }
    }
    case 'SET_VOLUME':
      return { ...state, volume: Math.min(1, Math.max(0, action.payload)) }
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted }
    case 'SET_REPEAT':
      return { ...state, repeat: action.payload }
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffle: !state.shuffle }
    case 'SEEK':
      return { ...state, currentTime: action.payload }
    case 'SET_QUEUE':
      return { ...state, queue: action.payload }
    case 'ADD_TO_QUEUE':
      return { ...state, queue: [...state.queue, action.payload] }
    case 'REMOVE_FROM_QUEUE': {
      const newQueue = state.queue.filter((_, i) => i !== action.payload)
      return { ...state, queue: newQueue }
    }
    case 'CLEAR_QUEUE':
      return { ...state, queue: [], currentTrack: null, currentIndex: -1 }
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload }
    default:
      return state
  }
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState)

  const play = useCallback((track: Track, tracks?: Track[]) => {
    dispatch({ type: 'PLAY', payload: { track, queue: tracks } })
  }, [])

  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE' })
  }, [])

  const resume = useCallback(() => {
    dispatch({ type: 'RESUME' })
  }, [])

  const next = useCallback(() => {
    dispatch({ type: 'NEXT' })
  }, [])

  const previous = useCallback(() => {
    dispatch({ type: 'PREVIOUS' })
  }, [])

  const setVolume = useCallback((volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume })
  }, [])

  const toggleMute = useCallback(() => {
    dispatch({ type: 'TOGGLE_MUTE' })
  }, [])

  const setRepeat = useCallback((mode: RepeatMode) => {
    dispatch({ type: 'SET_REPEAT', payload: mode })
  }, [])

  const toggleShuffle = useCallback(() => {
    dispatch({ type: 'TOGGLE_SHUFFLE' })
  }, [])

  const seek = useCallback((time: number) => {
    dispatch({ type: 'SEEK', payload: time })
  }, [])

  const setQueue = useCallback((tracks: Track[]) => {
    dispatch({ type: 'SET_QUEUE', payload: tracks })
  }, [])

  const addToQueue = useCallback((track: Track) => {
    dispatch({ type: 'ADD_TO_QUEUE', payload: track })
  }, [])

  const removeFromQueue = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_FROM_QUEUE', payload: index })
  }, [])

  const clearQueue = useCallback(() => {
    dispatch({ type: 'CLEAR_QUEUE' })
  }, [])

  const setCurrentTime = useCallback((time: number) => {
    dispatch({ type: 'SET_CURRENT_TIME', payload: time })
  }, [])

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
  }

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}
