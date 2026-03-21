import { AnimatedCard } from "./AnimatedCard";
import { Camera, Users } from "lucide-react";

interface CameraFeedProps {
  name: string;
  location: string;
  peopleCount: number;
  status: "live" | "offline";
  delay?: number;
}

export function CameraFeed({ name, location, peopleCount, status, delay = 0 }: CameraFeedProps) {
  return (
    <AnimatedCard delay={delay} className="overflow-hidden p-0">
      {/* Simulated feed area */}
      <div className="relative aspect-video bg-[hsl(220_20%_5%)] flex items-center justify-center overflow-hidden">
        {/* Scanline effect */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(0 0% 100% / 0.03) 2px, hsl(0 0% 100% / 0.03) 4px)"
          }}
        />
        
        {status === "live" ? (
          <>
            <Camera className="w-8 h-8 text-muted-foreground/30" />
            {/* Live badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-destructive/90 px-2 py-0.5 rounded text-[10px] font-medium text-destructive-foreground uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground animate-pulse" />
              Live
            </div>
            {/* People overlay */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-card/80 backdrop-blur-sm px-2.5 py-1 rounded-md">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium tabular-nums">{peopleCount}</span>
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Offline</p>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{location}</p>
      </div>
    </AnimatedCard>
  );
}
