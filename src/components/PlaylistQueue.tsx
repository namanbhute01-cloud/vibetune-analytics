import { AnimatedCard } from "./AnimatedCard";
import { ListMusic, Play, Pause, MoreHorizontal } from "lucide-react";
import { useState } from "react";

const queue = [
  { title: "Blinding Lights", artist: "The Weeknd", duration: "3:20" },
  { title: "Electric Feel", artist: "MGMT", duration: "3:49" },
  { title: "Take On Me", artist: "a-ha", duration: "3:48" },
  { title: "Levitating", artist: "Dua Lipa", duration: "3:23" },
  { title: "Dreams", artist: "Fleetwood Mac", duration: "4:14" },
];

export function PlaylistQueue() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <AnimatedCard delay={500}>
      <div className="flex items-center gap-2 mb-4">
        <ListMusic className="w-4 h-4 text-primary" />
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Up Next</p>
        <span className="ml-auto text-[10px] text-primary font-medium cursor-pointer hover:underline underline-offset-2 transition-colors hover:text-primary/80 active:scale-95">
          View All
        </span>
      </div>

      <div className="space-y-0.5">
        {queue.map((track, i) => {
          const isPlaying = playingIndex === i;
          const isHovered = hoveredIndex === i;

          return (
            <div
              key={track.title}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group relative",
                isPlaying ? "bg-[hsl(var(--violet)/0.1)] border border-[hsl(var(--violet)/0.15)]" : "hover:bg-muted/50 border border-transparent",
              )}
              style={{
                animation: `float-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${500 + i * 80}ms forwards`,
                opacity: 0,
              }}
              onClick={() => setPlayingIndex(isPlaying ? null : i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Number / Play / Pause */}
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {isPlaying ? (
                  <div className="flex items-end gap-[2px] h-3.5">
                    {[0, 1, 2].map(j => (
                      <div
                        key={j}
                        className="w-[3px] rounded-full bg-[hsl(var(--violet))]"
                        style={{
                          animation: `waveform 0.6s ease-in-out ${j * 0.15}s infinite`,
                          height: "4px",
                          transformOrigin: "bottom",
                        }}
                      />
                    ))}
                  </div>
                ) : isHovered ? (
                  <Play className="w-3.5 h-3.5 text-primary transition-transform duration-150 hover:scale-110" />
                ) : (
                  <span className="text-xs text-muted-foreground tabular-nums font-mono">{i + 1}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium truncate transition-colors duration-200",
                  isPlaying ? "text-[hsl(var(--violet))]" : "group-hover:text-foreground"
                )}>
                  {track.title}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">{track.artist}</p>
              </div>

              <span className={cn(
                "text-xs font-mono tabular-nums transition-opacity duration-150",
                isHovered ? "opacity-0" : "opacity-100 text-muted-foreground"
              )}>
                {track.duration}
              </span>

              {/* More button on hover */}
              <button className={cn(
                "absolute right-3 text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-90",
                isHovered ? "opacity-100" : "opacity-0"
              )}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </AnimatedCard>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
