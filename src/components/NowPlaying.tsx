import { AnimatedCard } from "./AnimatedCard";
import { Music, SkipBack, Play, SkipForward, Volume2 } from "lucide-react";

export function NowPlaying() {
  return (
    <AnimatedCard delay={400} className="glow-violet border-[hsl(var(--violet)/0.2)] relative overflow-hidden">
      {/* Ambient background animation */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-[spin_20s_linear_infinite] origin-center">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[hsl(var(--violet))] blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-[hsl(var(--info))] blur-3xl" />
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Music className="w-4 h-4 text-[hsl(var(--violet))]" />
          <p className="text-xs uppercase tracking-widest text-[hsl(var(--violet))] font-medium">Now Playing</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Vinyl disc */}
          <div className="relative w-16 h-16 shrink-0">
            <div className="w-16 h-16 rounded-full bg-[hsl(230_20%_8%)] border border-border/50 animate-[spin_3s_linear_infinite] flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border border-border/30 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[hsl(var(--violet)/0.8)]" style={{ boxShadow: "0 0 8px hsl(262 52% 62% / 0.4)" }} />
              </div>
              <div className="absolute inset-1 rounded-full border border-white/[0.02]" />
              <div className="absolute inset-3 rounded-full border border-white/[0.02]" />
              <div className="absolute inset-[18px] rounded-full border border-white/[0.02]" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Midnight City</p>
            <p className="text-xs text-muted-foreground truncate">M83 · Hurry Up, We're Dreaming</p>

            {/* Progress bar */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-mono tabular-nums">2:14</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden relative">
                <div className="h-full w-[58%] bg-[hsl(var(--violet))] rounded-full relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[hsl(var(--violet))] border-2 border-background" />
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono tabular-nums">3:52</span>
            </div>
          </div>
        </div>

        {/* Waveform */}
        <div className="flex items-center justify-center gap-[2px] mt-4 mb-2 h-6">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="w-[2px] rounded-full bg-[hsl(var(--violet)/0.4)]"
              style={{
                animation: `waveform 0.8s ease-in-out ${i * 0.05}s infinite`,
                height: "4px",
                transformOrigin: "bottom",
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5">
          <button className="text-muted-foreground hover:text-foreground transition-colors active:scale-95 duration-150">
            <SkipBack className="w-4 h-4" />
          </button>
          <button className="w-11 h-11 rounded-full bg-[hsl(var(--violet))] flex items-center justify-center text-white hover:bg-[hsl(var(--violet)/0.9)] transition-all active:scale-95 duration-150" style={{ boxShadow: "0 0 16px hsl(262 52% 62% / 0.3)" }}>
            <Play className="w-5 h-5 ml-0.5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors active:scale-95 duration-150">
            <SkipForward className="w-4 h-4" />
          </button>
          <div className="ml-auto flex items-center gap-2 text-muted-foreground">
            <Volume2 className="w-4 h-4" />
            <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[72%] bg-muted-foreground/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}
