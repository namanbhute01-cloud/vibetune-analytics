import React from 'react';
import { usePlayback } from '@/hooks/usePlayback';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Volume2,
  Music
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const MusicPlayer: React.FC = () => {
  const { status, play, pause, next, prev, toggleShuffle, setVolume } = usePlayback();

  if (!status) return null;

  const isPlaying = status.playing;
  const songName = status.song || 'Ready to Play';
  const progress = status.percent || 0;
  const volume = status.volume || 70;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border px-4 py-3 h-24 flex items-center justify-between shadow-lg">
      {/* Left: Song Info */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="w-14 h-14 bg-accent/20 rounded-md flex items-center justify-center border border-border shadow-inner">
          <Music className="w-6 h-6 text-primary animate-pulse" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-semibold text-sm truncate">{songName}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            {status.playing ? 'Now Playing' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Center: Controls & Progress */}
      <div className="flex flex-col items-center gap-2 w-1/3 max-w-md">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleShuffle}
            className={cn("hover:text-primary transition-colors", status.shuffle && "text-primary")}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={prev}>
            <SkipBack className="w-5 h-5 fill-current" />
          </Button>
          <Button 
            variant="default" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform"
            onClick={isPlaying ? pause : play}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={next}>
            <SkipForward className="w-5 h-5 fill-current" />
          </Button>
        </div>
        <div className="w-full flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-8 text-right">
            {Math.floor(progress)}%
          </span>
          <Progress value={progress} className="h-1 w-full" />
          <span className="text-[10px] text-muted-foreground w-8">
            100%
          </span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="flex items-center justify-end gap-3 w-1/3">
        <Volume2 className="w-4 h-4 text-muted-foreground" />
        <div className="w-24">
          <Slider
            defaultValue={[volume]}
            max={100}
            step={1}
            onValueChange={(vals) => setVolume(vals[0])}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
