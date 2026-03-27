import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { CameraGrid } from "@/components/CameraGrid";
import { NowPlaying } from "@/components/NowPlaying";
import { AgeGauge } from "@/components/AgeGauge";
import { PlaylistQueue } from "@/components/PlaylistQueue";
import { LiveClock } from "@/components/LiveClock";
import { Camera, Users, Music, Activity, Flame } from "lucide-react";
import { useVibeStream } from "@/hooks/useVibeStream";
import { useCameras } from "@/hooks/useCameras";
import { api } from "@/lib/api";

const Dashboard = () => {
  const { data: wsData } = useVibeStream();
  const { list: cameraList } = useCameras();
  
  const [faces, setFaces] = useState<any>(null);
  const [journal, setJournal] = useState<any>(null);

  useEffect(() => {
    const loadFaces = () => api.get('/faces/summary').then(setFaces).catch(() => {});
    const loadJournal = () => api.get('/vibe/journal').then(setJournal).catch(() => {});
    
    loadFaces(); 
    loadJournal();
    
    const faceInterval = setInterval(loadFaces, 10000);
    const journalInterval = setInterval(loadJournal, 5000);
    
    return () => {
      clearInterval(faceInterval);
      clearInterval(journalInterval);
    };
  }, []);

  // Extract real-time state from WebSocket or fallback to polled data
  const systemStatus = wsData?.type === 'status' ? wsData : null;
  const vibeUpdate = wsData?.type === 'vibe_update' ? wsData : null;
  
  // Vibe state comes from either 'status' or 'vibe_update'
  const vibe = vibeUpdate || systemStatus?.vibe || { current_vibe: 'Searching...', journal_size: 0, dominant_now: '...' };
  
  // Player state can also be updated in 'vibe_update' now
  const player = (vibeUpdate && vibeUpdate.is_playing !== undefined) 
    ? { playing: vibeUpdate.is_playing, song: vibeUpdate.current_song_group } 
    : (systemStatus?.player || { playing: false, song: 'Idle' });
  
  const faceStats = systemStatus?.faces || faces || { total_unique: 0, by_group: {} };
  
  // Calculate dynamic stats
  const activeCams = cameraList.length;
  const peopleDetected = wsData?.type === 'detection' ? (wsData.data?.length || 0) : 0; 
  const avgAge = vibe.dominant_now || vibe.detected_group || '...';


  const ageBreakdown = [
    { range: "Kids", count: faceStats.by_group?.kids || 0, color: "hsl(43 96% 56%)" },
    { range: "Youths", count: faceStats.by_group?.youths || 0, color: "hsl(173 58% 39%)" },
    { range: "Adults", count: faceStats.by_group?.adults || 0, color: "hsl(262 52% 62%)" },
    { range: "Seniors", count: faceStats.by_group?.seniors || 0, color: "hsl(346 72% 58%)" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div
          className="flex items-end justify-between gap-4 pb-2 border-b border-border/30"
          style={{ animation: "float-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-widest">Live Ambiance Control</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight leading-none">
              Vibe Alchemist
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Real-time ambiance intelligence active for {activeCams} sources
            </p>
          </div>
          <LiveClock />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Camera} label="Active Cameras" value={activeCams} sub="All streams online" delay={100} trend="neutral" color="teal" />
          <StatCard icon={Users} label="Unique Faces" value={faceStats.total_unique} sub="Across all time" delay={160} trend="up" color="rose" />
          <StatCard icon={Activity} label="Current Vibe" value={vibe.current_vibe?.toUpperCase()} sub={`Log: ${vibe.journal_size} events`} delay={220} glow trend="neutral" color="amber" />
          <StatCard icon={Music} label="Music Status" value={player.playing ? "PLAYING" : "PAUSED"} sub={player.song} delay={280} trend="up" color="violet" />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera feeds - 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Live Vision Grid</h2>
              <div className="flex-1 h-px bg-border/30" />
              <span className="text-[10px] text-[hsl(var(--info))] font-mono tabular-nums pulse-dot pr-4">{activeCams} sources</span>
            </div>
            
            <CameraGrid />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Ambiance Engine</h2>
              <div className="flex-1 h-px bg-border/30" />
            </div>
            <NowPlaying />
            <AgeGauge avgAge={avgAge} ageBreakdown={ageBreakdown} delay={450} />
            <PlaylistQueue />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
