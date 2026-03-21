import { AnimatedCard } from "./AnimatedCard";
import { ListMusic } from "lucide-react";

const queue = [
  { title: "Blinding Lights", artist: "The Weeknd", duration: "3:20" },
  { title: "Electric Feel", artist: "MGMT", duration: "3:49" },
  { title: "Take On Me", artist: "a-ha", duration: "3:48" },
  { title: "Levitating", artist: "Dua Lipa", duration: "3:23" },
  { title: "Dreams", artist: "Fleetwood Mac", duration: "4:14" },
];

export function PlaylistQueue() {
  return (
    <AnimatedCard delay={500}>
      <div className="flex items-center gap-2 mb-4">
        <ListMusic className="w-4 h-4 text-primary" />
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Up Next</p>
        <span className="ml-auto text-[10px] text-primary font-medium cursor-pointer hover:underline">
          View All
        </span>
      </div>

      <div className="space-y-1">
        {queue.map((track, i) => (
          <div
            key={track.title}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
            style={{
              animation: `float-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${500 + i * 80}ms forwards`,
              opacity: 0,
            }}
          >
            <span className="text-xs text-muted-foreground tabular-nums w-4">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{track.title}</p>
              <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
            </div>
            <span className="text-xs text-muted-foreground font-mono tabular-nums">{track.duration}</span>
          </div>
        ))}
      </div>
    </AnimatedCard>
  );
}
