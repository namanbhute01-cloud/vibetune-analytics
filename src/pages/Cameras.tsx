import { DashboardLayout } from "@/components/DashboardLayout";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Camera, Maximize2, Minimize2, Users, Eye, AlertTriangle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

const allCameras = [
  { id: 1, name: "Cam 01 — Entrance", location: "Main Door", peopleCount: 12, status: "live" as const, fps: 30 },
  { id: 2, name: "Cam 02 — Dining Hall", location: "Floor 1", peopleCount: 23, status: "live" as const, fps: 28 },
  { id: 3, name: "Cam 03 — Bar Area", location: "West Wing", peopleCount: 8, status: "live" as const, fps: 30 },
  { id: 4, name: "Cam 04 — Terrace", location: "Rooftop", peopleCount: 0, status: "offline" as const, fps: 0 },
  { id: 5, name: "Cam 05 — Kitchen", location: "Back", peopleCount: 5, status: "live" as const, fps: 25 },
  { id: 6, name: "Cam 06 — VIP Lounge", location: "Floor 2", peopleCount: 4, status: "live" as const, fps: 30 },
];

function LiveTimestamp() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="font-mono text-[10px] tabular-nums text-muted-foreground">{time.toLocaleTimeString()}</span>;
}

function CameraCard({ cam, onExpand, isExpanded }: { cam: typeof allCameras[0]; onExpand: () => void; isExpanded: boolean }) {
  const [hovered, setHovered] = useState(false);
  const isOffline = cam.status === "offline";

  return (
    <div
      className={`relative rounded-xl border overflow-hidden transition-all duration-300 group cursor-pointer ${
        isExpanded ? "col-span-full row-span-2" : ""
      } ${isOffline ? "border-destructive/30 opacity-60" : "border-border/50 hover:border-[hsl(var(--info))/0.4]"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animation: `float-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${cam.id * 100}ms forwards`, opacity: 0 }}
    >
      {/* Camera viewport */}
      <div className={`relative bg-card ${isExpanded ? "aspect-video" : "aspect-[4/3]"}`}>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-[1]" />

        {/* Scanline */}
        {!isOffline && hovered && (
          <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
            <div className="absolute left-0 w-full h-px bg-[hsl(var(--info))/0.4]" style={{ animation: "scanline 3s linear infinite" }} />
          </div>
        )}

        {/* Tactical corners */}
        {!isOffline && (
          <>
            <div className={`absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[hsl(var(--info))] z-[3] transition-all duration-300 ${hovered ? "w-8 h-8 opacity-100" : "opacity-50"}`} />
            <div className={`absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[hsl(var(--info))] z-[3] transition-all duration-300 ${hovered ? "w-8 h-8 opacity-100" : "opacity-50"}`} />
            <div className={`absolute bottom-12 left-3 w-6 h-6 border-b-2 border-l-2 border-[hsl(var(--info))] z-[3] transition-all duration-300 ${hovered ? "w-8 h-8 opacity-100" : "opacity-50"}`} />
            <div className={`absolute bottom-12 right-3 w-6 h-6 border-b-2 border-r-2 border-[hsl(var(--info))] z-[3] transition-all duration-300 ${hovered ? "w-8 h-8 opacity-100" : "opacity-50"}`} />
          </>
        )}

        {/* Detection boxes */}
        {!isOffline && hovered && (
          <div className="absolute inset-0 z-[2] pointer-events-none">
            {Array.from({ length: Math.min(cam.peopleCount, 4) }).map((_, i) => (
              <div
                key={i}
                className="absolute border border-[hsl(var(--rose))/0.6] rounded-sm"
                style={{
                  width: `${14 + Math.random() * 6}%`,
                  height: `${20 + Math.random() * 15}%`,
                  left: `${15 + i * 18 + Math.random() * 5}%`,
                  top: `${20 + Math.random() * 20}%`,
                  animation: `float-in 0.3s ease-out ${i * 100}ms forwards`,
                  opacity: 0,
                }}
              >
                <span className="absolute -top-4 left-0 text-[8px] font-mono text-[hsl(var(--rose))] bg-background/60 px-1 rounded">
                  ID-{String(i + 1).padStart(3, "0")}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* REC badge */}
        {!isOffline && (
          <div className="absolute top-3 right-12 z-[3] flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--rose))] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--rose))]" />
            </span>
            <span className="text-[9px] font-mono font-bold text-[hsl(var(--rose))]">REC</span>
          </div>
        )}

        {/* Offline overlay */}
        {isOffline && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-[3] gap-2">
            <AlertTriangle className="w-8 h-8 text-destructive/60" />
            <span className="text-xs text-destructive/80 font-medium">Camera Offline</span>
            <button className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md border border-border/50 hover:border-border transition-colors">
              <RefreshCw className="w-3 h-3" /> Reconnect
            </button>
          </div>
        )}

        {/* Bottom info bar */}
        <div className="absolute bottom-0 left-0 right-0 z-[3] px-4 py-3 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium">{cam.name}</p>
            <p className="text-[10px] text-muted-foreground">{cam.location}</p>
          </div>
          <div className="flex items-center gap-3">
            {!isOffline && (
              <>
                <div className="flex items-center gap-1 text-[10px] font-mono">
                  <Users className="w-3 h-3 text-[hsl(var(--rose))]" />
                  <span className="text-[hsl(var(--rose))]">{cam.peopleCount}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  {cam.fps}fps
                </div>
              </>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onExpand(); }}
              className="p-1 rounded hover:bg-muted/50 transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CamerasPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const totalPeople = allCameras.reduce((s, c) => s + c.peopleCount, 0);
  const liveCount = allCameras.filter(c => c.status === "live").length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-end justify-between gap-4 pb-2 border-b border-border/30" style={{ animation: "float-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Camera className="w-5 h-5 text-[hsl(var(--info))]" />
              <span className="text-xs font-medium text-[hsl(var(--info))] uppercase tracking-widest">Surveillance Grid</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Camera Feeds</h1>
            <p className="text-sm text-muted-foreground mt-1">Live monitoring across all zones</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-[hsl(var(--info))]">{liveCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Live</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[hsl(var(--rose))]">{totalPeople}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">People</p>
            </div>
            <LiveTimestamp />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allCameras.map(cam => (
            <CameraCard
              key={cam.id}
              cam={cam}
              isExpanded={expandedId === cam.id}
              onExpand={() => setExpandedId(expandedId === cam.id ? null : cam.id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
