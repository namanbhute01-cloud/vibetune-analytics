import { DashboardLayout } from "@/components/DashboardLayout";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Music, Play, Pause, SkipForward, Shuffle, Plus, Search, Filter, Disc } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { usePlayback } from "@/hooks/usePlayback";
import { useVibeStream } from "@/hooks/useVibeStream";
import { cn } from "@/lib/utils";

type Track = { id: string; title: string; group: string };

const ageFilters = ["All", "kids", "youths", "adults", "seniors"];

export default function PlaylistPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("All");
  const { status, pause, play, next } = usePlayback();
  const vibeState = useVibeStream();

  // Load library from backend
  useEffect(() => {
    const loadLibrary = () => {
      api.getLibrary()
        .then(lib => {
          const allTracks: Track[] = [];
          Object.entries(lib).forEach(([group, files]) => {
            (files as string[]).forEach((file, idx) => {
              allTracks.push({
                id: `${group}-${idx}`,
                title: file.replace(/\.[^/.]+$/, ""), // Remove extension
                group: group
              });
            });
          });
          setTracks(allTracks);
          setLoading(false);
        })
        .catch(err => {
          console.error('[Playlist] Load error:', err);
          setLoading(false);
        });
    };
    loadLibrary();
  }, []);

  const filtered = tracks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchAge = ageFilter === "All" || t.group === ageFilter;
    return matchSearch && matchAge;
  });

  const currentSong = vibeState?.current_song || status?.song || "None";
  const isPlaying = !(vibeState?.paused ?? status?.paused ?? true);

  const handlePlayTrack = (track: Track) => {
    // For now, just show it's selected - actual playback requires backend action
    console.log('[Playlist] Selected:', track);
    // Could add a "play this track" endpoint later
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-end justify-between gap-4 pb-2 border-b border-border/30" style={{ animation: "float-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Music className="w-5 h-5 text-[hsl(var(--violet))]" />
              <span className="text-xs font-medium text-[hsl(var(--violet))] uppercase tracking-widest">Music Engine</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Playlist</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage tracks & age-group mappings</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Track
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3" style={{ animation: "float-in 0.5s ease-out 100ms forwards", opacity: 0 }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tracks..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-border/50 text-sm focus:outline-none focus:border-[hsl(var(--violet))/0.5] transition-colors placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-1.5">
            {ageFilters.map(f => (
              <button
                key={f}
                onClick={() => setAgeFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                  ageFilter === f
                    ? "bg-[hsl(var(--violet))/0.15] text-[hsl(var(--violet))] border border-[hsl(var(--violet))/0.3]"
                    : "text-muted-foreground border border-border/50 hover:bg-muted/30"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Now Playing Banner */}
        {currentSong !== "None" && (
          <AnimatedCard delay={0} className="border-[hsl(var(--violet))/0.3] bg-[hsl(var(--violet))/0.03]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[hsl(var(--violet))/0.15] flex items-center justify-center">
                <Disc className={cn("w-6 h-6 text-[hsl(var(--violet))]", isPlaying && "animate-spin")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[hsl(var(--violet))]">{currentSong}</p>
                <p className="text-xs text-muted-foreground">Vibe Controlled Ambiance</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => pause()} className="p-2 rounded-full hover:bg-muted/50 transition-colors">
                  <Pause className="w-4 h-4 text-[hsl(var(--violet))]" />
                </button>
                <button onClick={() => next()} className="p-2 rounded-full hover:bg-muted/50 transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>
          </AnimatedCard>
        )}

        {/* Track List */}
        <AnimatedCard delay={200}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {loading ? "Loading..." : `${filtered.length} tracks`}
            </p>
            <p className="text-[10px] text-muted-foreground">Organized by age group</p>
          </div>
          
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">
              <Music className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm">Loading music library...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-0.5">
              {filtered.map((track, i) => {
                const isCurrent = currentSong.includes(track.title);
                return (
                  <div
                    key={track.id}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer group ${
                      isCurrent ? "bg-[hsl(var(--violet))/0.08] border border-[hsl(var(--violet))/0.2]" : "hover:bg-muted/30 border border-transparent"
                    }`}
                    onClick={() => handlePlayTrack(track)}
                    style={{ animation: `float-in 0.4s ease-out ${200 + i * 50}ms forwards`, opacity: 0 }}
                  >
                    {/* Play indicator */}
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      {isCurrent ? (
                        <div className="flex items-end gap-[2px] h-3.5">
                          {[0, 1, 2].map(j => (
                            <div key={j} className="w-[3px] rounded-full bg-[hsl(var(--violet))]" style={{ animation: `waveform 0.6s ease-in-out ${j * 0.15}s infinite`, height: "4px", transformOrigin: "bottom" }} />
                          ))}
                        </div>
                      ) : (
                        <Play className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isCurrent ? "text-[hsl(var(--violet))]" : ""}`}>{track.title}</p>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono capitalize">{track.group}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Music className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm">No tracks found</p>
              <p className="text-xs mt-1">Add music files to the OfflinePlayback folders</p>
            </div>
          )}
        </AnimatedCard>
      </div>
    </DashboardLayout>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
