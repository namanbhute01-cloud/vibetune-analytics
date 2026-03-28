import { usePlayback } from '@/hooks/usePlayback'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { SkipBack, Play, Pause, SkipForward, Shuffle, Volume2, Music } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MusicPlayer() {
  const { status, pause, next, prev, shuffle, setVol } = usePlayback()

  if (!status) return null

  const song = (status.song || 'None').slice(0, 30) + ((status.song || '').length > 30 ? '...' : '')

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-white/5 px-6 py-3 h-24 flex items-center justify-between shadow-2xl">
      {/* Left: Info */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
          <Music className={cn("w-6 h-6 text-primary", !status.paused && "animate-pulse")} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-bold text-white truncate">{song}</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
              {status.paused ? 'Paused' : 'Now Playing'}
            </span>
            <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-primary/30 text-primary uppercase font-bold">
              {status.group}
            </Badge>
          </div>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center gap-2 w-1/3 max-w-md">
        <div className="flex items-center gap-4">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white" onClick={() => prev()}>
            <SkipBack className="w-4 h-4 fill-current" />
          </Button>
          <Button 
            size="icon" 
            variant="default" 
            className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform" 
            onClick={() => pause()}
          >
            {status.paused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white" onClick={() => next()}>
            <SkipForward className="w-4 h-4 fill-current" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className={cn("h-8 w-8 transition-colors", status.shuffle ? "text-primary" : "text-muted-foreground")}
            onClick={() => shuffle()}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
            {Math.floor(status.percent || 0)}%
          </span>
          <Slider value={[status.percent || 0]} max={100} step={1} disabled className="flex-1 opacity-50" />
          <span className="text-[10px] font-mono text-muted-foreground w-8">100%</span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="flex items-center justify-end gap-3 w-1/3">
        <Volume2 className="w-4 h-4 text-muted-foreground" />
        <div className="w-24">
          <Slider
            value={[status.volume ?? 70]} 
            max={100} 
            step={1}
            onValueChange={([v]) => setVol(v)}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
