import { AnimatedCard } from "./AnimatedCard";
import { Camera, Users, Wifi, WifiOff, Maximize2 } from "lucide-react";
import { useState, useEffect } from "react";

interface CameraFeedProps {
  name: string;
  location: string;
  peopleCount: number;
  status: "live" | "offline";
  delay?: number;
}

function LiveTimestamp() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, []);

  return <>{time}</>;
}

export function CameraFeed({ name, location, peopleCount, status, delay = 0 }: CameraFeedProps) {
  return (
    <AnimatedCard delay={delay} className="overflow-hidden p-0 group cursor-pointer">
      <div className="relative aspect-video bg-[hsl(230_18%_4%)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(0 0% 100% / 0.04) 2px, hsl(0 0% 100% / 0.04) 4px)"
          }}
        />
        {/* Corner brackets - animate on hover */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-[hsl(var(--info)/0.4)] transition-all duration-300 group-hover:w-6 group-hover:h-6 group-hover:border-[hsl(var(--info)/0.7)]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-[hsl(var(--info)/0.4)] transition-all duration-300 group-hover:w-6 group-hover:h-6 group-hover:border-[hsl(var(--info)/0.7)]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-[hsl(var(--info)/0.4)] transition-all duration-300 group-hover:w-6 group-hover:h-6 group-hover:border-[hsl(var(--info)/0.7)]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-[hsl(var(--info)/0.4)] transition-all duration-300 group-hover:w-6 group-hover:h-6 group-hover:border-[hsl(var(--info)/0.7)]" />

        {status === "live" ? (
          <>
            <Camera className="w-8 h-8 text-muted-foreground/20 group-hover:text-muted-foreground/10 transition-colors duration-300" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[hsl(var(--rose)/0.9)] px-2 py-0.5 rounded text-[10px] font-medium text-white uppercase tracking-wider backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              REC
            </div>
            <div className="absolute top-3 right-3 text-[9px] font-mono text-muted-foreground/50 tabular-nums">
              <LiveTimestamp />
            </div>
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-card/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-border/30 transition-transform duration-200 group-hover:scale-105">
              <Users className="w-3.5 h-3.5 text-[hsl(var(--info))]" />
              <span className="text-xs font-semibold tabular-nums">{peopleCount}</span>
            </div>

            {/* Expand button */}
            <button className="absolute bottom-3 left-3 p-1.5 rounded-md bg-card/60 backdrop-blur-sm border border-border/20 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-card hover:text-foreground active:scale-90">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Detection grid on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0" style={{
                backgroundImage: "linear-gradient(hsl(173 58% 39% / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(173 58% 39% / 0.05) 1px, transparent 1px)",
                backgroundSize: "40px 40px"
              }} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/50 group-hover:text-muted-foreground/70 transition-colors">
            <WifiOff className="w-6 h-6" />
            <p className="text-xs">Signal Lost</p>
            <button className="mt-1 text-[10px] text-primary/70 hover:text-primary transition-colors underline underline-offset-2">
              Retry Connection
            </button>
          </div>
        )}
      </div>
      <div className="p-3 flex items-center justify-between group-hover:bg-[hsl(var(--surface-elevated))] transition-colors duration-200">
        <div>
          <p className="text-sm font-medium group-hover:text-foreground transition-colors">{name}</p>
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
