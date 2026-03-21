import { AnimatedCard } from "./AnimatedCard";
import { Music, SkipBack, Play, SkipForward, Volume2 } from "lucide-react";

export function NowPlaying() {
  return (
    <AnimatedCard delay={400} className="glow-amber border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Music className="w-4 h-4 text-primary" />
        <p className="text-xs uppercase tracking-widest text-primary font-medium">Now Playing</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Album art placeholder */}
        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <EqualizerBars />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">Midnight City</p>
          <p className="text-xs text-muted-foreground truncate">M83 · Hurry Up, We're Dreaming</p>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-mono tabular-nums">2:14</span>
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[58%] bg-primary rounded-full" />
            </div>
            <span className="text-[10px] text-muted-foreground font-mono tabular-nums">3:52</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button className="text-muted-foreground hover:text-foreground transition-colors active:scale-95">
          <SkipBack className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors active:scale-95">
          <Play className="w-4 h-4 ml-0.5" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors active:scale-95">
          <SkipForward className="w-4 h-4" />
        </button>
        <div className="ml-auto flex items-center gap-2 text-muted-foreground">
          <Volume2 className="w-4 h-4" />
          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-[72%] bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}

function EqualizerBars() {
  const bars = [12, 20, 8, 16, 10];
  return (
    <div className="flex items-end gap-[3px] h-6">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-primary"
          style={{
            ["--bar-height" as string]: `${h}px`,
            animation: `eq-bar 1.2s ease-in-out ${i * 0.15}s infinite`,
            height: "4px",
          }}
        />
      ))}
    </div>
  );
}
