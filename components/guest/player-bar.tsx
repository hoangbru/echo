'use client';

import { usePlayer } from '@/lib/contexts/player-context';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat2, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Link from 'next/link';
import Image from 'next/image';

export function PlayerBar() {
  const { state, pause, resume, next, previous, toggleShuffle, setRepeat, setVolume, seek } = usePlayer();

  if (!state.currentTrack) {
    return (
      <div className="h-20 sm:h-24 border-t border-border bg-card flex items-center justify-center text-muted-foreground fixed bottom-0 left-0 right-0 lg:static">
        <p className="text-xs sm:text-sm">Select a song to start playing</p>
      </div>
    );
  }

  const handlePlayPause = () => {
    if (state.isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const handleNext = () => {
    next();
  };

  const handlePrevious = () => {
    previous();
  };

  const handleToggleShuffle = () => {
    toggleShuffle();
  };

  const handleToggleRepeat = () => {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(state.repeat);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeat(nextMode);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  const handleProgressChange = (value: number[]) => {
    seek(value[0]);
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 z-40 border-t border-border bg-card lg:static">
      {/* Progress Bar */}
      <div className="px-4 sm:px-6 pt-2 pb-1">
        <Slider
          value={[state.currentTime]}
          max={state.duration}
          step={0.1}
          onValueChange={handleProgressChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span className="text-xs">{formatTime(state.currentTime)}</span>
          <span className="text-xs">{formatTime(state.duration)}</span>
        </div>
      </div>

      {/* Player Controls */}
      <div className="px-4 sm:px-6 pb-3 sm:pb-4 flex items-center justify-between gap-2 sm:gap-4">
        {/* Now Playing Info - Hidden on mobile, shown on sm+ */}
        <Link href={`/track/${state.currentTrack.id}`} className="hidden sm:flex flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition">
            {state.currentTrack.image && (
              <div className="relative h-10 sm:h-14 w-10 sm:w-14 flex-shrink-0 rounded bg-secondary overflow-hidden">
                <Image
                  src={state.currentTrack.image}
                  alt={state.currentTrack.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 hidden sm:block">
              <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                {state.currentTrack.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {state.currentTrack.artist}
              </p>
            </div>
          </div>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-1 sm:gap-2 justify-center flex-1 sm:flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleShuffle}
            className={`${state.shuffle ? 'text-primary' : ''} h-8 w-8 sm:h-10 sm:w-10`}
          >
            <Shuffle className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <Button
            size="icon"
            onClick={handlePlayPause}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-9 w-9 sm:h-10 sm:w-10"
          >
            {state.isPlaying ? (
              <Pause className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
            ) : (
              <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleRepeat}
            className={`${state.repeat !== 'off' ? 'text-primary' : ''} h-8 w-8 sm:h-10 sm:w-10`}
          >
            <Repeat2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* Volume Control - Hidden on mobile, shown on sm+ */}
        <div className="hidden sm:flex flex-1 items-center justify-end gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[state.volume * 100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
}
