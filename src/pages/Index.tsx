import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { CameraFeed } from "@/components/CameraFeed";
import { NowPlaying } from "@/components/NowPlaying";
import { AgeGauge } from "@/components/AgeGauge";
import { PlaylistQueue } from "@/components/PlaylistQueue";
import { Camera, Users, Music, Activity } from "lucide-react";

const ageBreakdown = [
  { range: "18–25", count: 8, color: "hsl(38 92% 50%)" },
  { range: "26–35", count: 14, color: "hsl(25 80% 55%)" },
  { range: "36–45", count: 6, color: "hsl(152 60% 42%)" },
  { range: "46+", count: 3, color: "hsl(220 10% 50%)" },
];

const cameras = [
  { name: "Cam 01 — Entrance", location: "Main Door", peopleCount: 12, status: "live" as const },
  { name: "Cam 02 — Dining Hall", location: "Floor 1", peopleCount: 23, status: "live" as const },
  { name: "Cam 03 — Bar Area", location: "West Wing", peopleCount: 8, status: "live" as const },
  { name: "Cam 04 — Terrace", location: "Rooftop", peopleCount: 0, status: "offline" as const },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div
          className="mb-2"
          style={{ animation: "float-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
        >
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time ambiance intelligence for your restaurant
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Camera} label="Active Cameras" value={3} sub="1 offline" delay={100} />
          <StatCard icon={Users} label="People Detected" value={43} sub="+7 last 10 min" delay={160} />
          <StatCard icon={Activity} label="Avg Age" value={28} sub="Trending younger" delay={220} glow />
          <StatCard icon={Music} label="Playlist Match" value="92%" sub="Pop / Indie" delay={280} />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Camera feeds - 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Live Feeds</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cameras.map((cam, i) => (
                <CameraFeed key={cam.name} {...cam} delay={300 + i * 80} />
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Ambiance Engine</h2>
            <NowPlaying />
            <AgeGauge avgAge={28} ageBreakdown={ageBreakdown} delay={450} />
            <PlaylistQueue />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
