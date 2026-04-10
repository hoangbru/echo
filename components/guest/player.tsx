'use client'

import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '@/lib/contexts/player-context'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Repeat1,
  Shuffle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

export function Player() {
  const { state, play, pause, resume, next, previous, setVolume, setRepeat, toggleShuffle, setCurrentTime } = usePlayer()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle audio playback
  useEffect(() => {
    if (!isMounted || !audioRef.current) return

    if (state.currentTrack && state.isPlaying) {
      audioRef.current.src = state.currentTrack.audioUrl
      audioRef.current.volume = state.volume
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Error playing audio:', error)
        })
      }
    } else if (!state.isPlaying) {
      audioRef.current.pause()
    }
  }, [state.currentTrack, state.isPlaying, isMounted])

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume
    }
  }, [state.volume])

  // Handle seek
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = state.currentTime
    }
  }, [state.currentTime])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleEnded = () => {
    if (state.repeat === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else {
      next()
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  const handleProgressChange = (value: number[]) => {
    setCurrentTime(value[0])
  }

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isMounted || !state.currentTrack) {
    return null
  }

  const duration = state.currentTrack.duration || 0

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-neutral-900 border-t border-neutral-800 p-4">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        crossOrigin="anonymous"
      />

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span>{formatTime(state.currentTime)}</span>
          <Slider
            value={[state.currentTime]}
            max={duration}
            step={0.1}
            onValueChange={handleProgressChange}
            className="flex-1"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Track Info & Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Track Info */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">{state.currentTrack.title}</p>
          <p className="text-xs text-neutral-400 truncate">{state.currentTrack.artist}</p>
        </div>

        {/* Main Controls */}
        <div className="flex items-center gap-2">
          {/* Shuffle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleShuffle}
            className={cn(state.shuffle && 'text-red-500')}
          >
            <Shuffle className="w-4 h-4" />
          </Button>

          {/* Previous */}
          <Button variant="ghost" size="sm" onClick={previous}>
            <SkipBack className="w-4 h-4 fill-current" />
          </Button>

          {/* Play/Pause */}
          <Button
            onClick={state.isPlaying ? pause : resume}
            className="bg-white text-black hover:bg-neutral-100 rounded-full p-2"
          >
            {state.isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current" />
            )}
          </Button>

          {/* Next */}
          <Button variant="ghost" size="sm" onClick={next}>
            <SkipForward className="w-4 h-4 fill-current" />
          </Button>

          {/* Repeat */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one']
              const currentIndex = modes.indexOf(state.repeat)
              const nextMode = modes[(currentIndex + 1) % modes.length]
              setRepeat(nextMode)
            }}
            className={cn(state.repeat !== 'off' && 'text-red-500')}
          >
            {state.repeat === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Volume Control */}
        <div className="w-24 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-neutral-400" />
          <Slider
            value={[state.volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  )
}
