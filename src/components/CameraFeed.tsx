import { AnimatedCard } from "./AnimatedCard";
import { Camera, Users, Wifi, WifiOff } from "lucide-react";

interface CameraFeedProps {
  name: string;
  location: string;
  peopleCount: number;
  status: "live" | "offline";
  delay?: number;
}

export function CameraFeed({ name, location, peopleCount, status, delay = 0 }: CameraFeedProps) {
  return (
    <AnimatedCard delay={delay} className="overflow-hidden p-0 group">
      {/* Simulated feed area */}
      <div className="relative aspect-video bg-[hsl(220_20%_5%)] flex items-center justify-center overflow-hidden">
        {/* Animated noise texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(0 0% 100% / 0.04) 2px, hsl(0 0% 100% / 0.04) 4px)"
          }}
        />
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-primary/40" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-primary/40" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-primary/40" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-primary/40" />

        {status === "live" ? (
          <>
            <Camera className="w-8 h-8 text-muted-foreground/20" />
            {/* REC badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-destructive/90 px-2 py-0.5 rounded text-[10px] font-medium text-destructive-foreground uppercase tracking-wider backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground animate-pulse" />
              REC
            </div>
            {/* Timestamp */}
            <div className="absolute top-3 right-3 text-[9px] font-mono text-muted-foreground/50 tabular-nums">
              {new Date().toLocaleTimeString()}
            </div>
            {/* People overlay */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-card/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-border/30">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold tabular-nums">{peopleCount}</span>
            </div>
            {/* Detection grid lines */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0" style={{
                backgroundImage: "linear-gradient(hsl(38 92% 50% / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(38 92% 50% / 0.05) 1px, transparent 1px)",
                backgroundSize: "40px 40px"
              }} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
            <WifiOff className="w-6 h-6" />
            <p className="text-xs">Signal Lost</p>
          </div>
        )}
      </div>
      <div className="p-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
        {status === "live" ? (
          <Wifi className="w-3.5 h-3.5 text-[hsl(var(--success))]" />
        ) : (
          <WifiOff className="w-3.5 h-3.5 text-muted-foreground/40" />
        )}
      </div>
    </AnimatedCard>
  );
}
