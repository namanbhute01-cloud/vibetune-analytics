import { AnimatedCard } from "./AnimatedCard";
import { Music, SkipBack, Play, Pause, SkipForward, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";

export function NowPlaying() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(58);
  const [volume, setVolume] = useState(72);

  // Simulate progress when playing
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setProgress(p => p >= 100 ? 0 : p + 0.3);
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying]);

  const currentTime = Math.floor((progress / 100) * 232);
  const mins = Math.floor(currentTime / 60);
  const secs = currentTime % 60;

  return (
    <AnimatedCard delay={400} className="glow-violet border-[hsl(var(--violet)/0.2)] relative overflow-hidden">
      {/* Ambient background animation */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className={cn("absolute -top-1/2 -left-1/2 w-[200%] h-[200%] origin-center", isPlaying && "animate-[spin_20s_linear_infinite]")}>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[hsl(var(--violet))] blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-[hsl(var(--info))] blur-3xl" />
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Music className="w-4 h-4 text-[hsl(var(--violet))]" />
          <p className="text-xs uppercase tracking-widest text-[hsl(var(--violet))] font-medium">Now Playing</p>
          <div className={cn("ml-auto flex items-center gap-1.5 text-[10px] font-mono", isPlaying ? "text-[hsl(var(--success))]" : "text-muted-foreground")}>
            <span className={cn("w-1.5 h-1.5 rounded-full", isPlaying ? "bg-[hsl(var(--success))] animate-pulse" : "bg-muted-foreground")} />
            {isPlaying ? "LIVE" : "PAUSED"}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Vinyl disc */}
          <div className="relative w-16 h-16 shrink-0 cursor-pointer group/vinyl" onClick={() => setIsPlaying(!isPlaying)}>
            <div className={cn(
              "w-16 h-16 rounded-full bg-[hsl(230_20%_8%)] border border-border/50 flex items-center justify-center transition-all duration-300",
              isPlaying && "animate-[spin_3s_linear_infinite]",
              "group-hover/vinyl:border-[hsl(var(--violet)/0.5)]"
            )}>
              <div className="w-10 h-10 rounded-full border border-border/30 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[hsl(var(--violet)/0.8)] transition-shadow duration-300" style={{ boxShadow: isPlaying ? "0 0 12px hsl(262 52% 62% / 0.5)" : "none" }} />
              </div>
              <div className="absolute inset-1 rounded-full border border-white/[0.02]" />
              <div className="absolute inset-3 rounded-full border border-white/[0.02]" />
              <div className="absolute inset-[18px] rounded-full border border-white/[0.02]" />
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover/vinyl:opacity-100 transition-opacity duration-200">
              {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Midnight City</p>
            <p className="text-xs text-muted-foreground truncate">M83 · Hurry Up, We're Dreaming</p>

            {/* Interactive progress bar */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-mono tabular-nums">{mins}:{secs.toString().padStart(2, '0')}</span>
              <div 
                className="flex-1 h-1.5 bg-muted rounded-full overflow-visible relative cursor-pointer group/progress"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setProgress(((e.clientX - rect.left) / rect.width) * 100);
                }}
              >
                <div className="h-full bg-[hsl(var(--violet))] rounded-full relative transition-all duration-150" style={{ width: `${progress}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[hsl(var(--violet))] border-2 border-background scale-0 group-hover/progress:scale-100 transition-transform duration-150" />
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono tabular-nums">3:52</span>
            </div>
          </div>
        </div>

        {/* Waveform - responds to play state */}
        <div className="flex items-center justify-center gap-[2px] mt-4 mb-2 h-6">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className={cn("w-[2px] rounded-full transition-colors duration-300",
                isPlaying ? "bg-[hsl(var(--violet)/0.5)]" : "bg-muted-foreground/20"
              )}
              style={{
                animation: isPlaying ? `waveform 0.8s ease-in-out ${i * 0.05}s infinite` : "none",
                height: isPlaying ? "4px" : `${4 + Math.sin(i * 0.5) * 6}px`,
                transformOrigin: "bottom",
                transition: "height 0.5s ease",
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5">
          <button className="text-muted-foreground hover:text-foreground transition-all active:scale-90 duration-150 hover:bg-muted/50 rounded-full p-2 -m-2">
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center text-white transition-all active:scale-90 duration-150",
              isPlaying
                ? "bg-[hsl(var(--violet))] hover:bg-[hsl(var(--violet)/0.85)]"
                : "bg-muted-foreground/30 hover:bg-[hsl(var(--violet))]"
            )}
            style={{ boxShadow: isPlaying ? "0 0 20px hsl(262 52% 62% / 0.35)" : "none" }}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-all active:scale-90 duration-150 hover:bg-muted/50 rounded-full p-2 -m-2">
            <SkipForward className="w-4 h-4" />
          </button>
          <div className="ml-auto flex items-center gap-2 text-muted-foreground group/vol">
            <Volume2 className="w-4 h-4 group-hover/vol:text-foreground transition-colors" />
            <div 
              className="w-16 h-1 bg-muted rounded-full overflow-visible relative cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setVolume(((e.clientX - rect.left) / rect.width) * 100);
              }}
            >
              <div className="h-full bg-muted-foreground/50 rounded-full transition-all" style={{ width: `${volume}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-foreground scale-0 group-hover/vol:scale-100 transition-transform" style={{ left: `${volume}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
