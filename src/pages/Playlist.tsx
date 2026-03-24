import { DashboardLayout } from "@/components/DashboardLayout";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Music, Play, Pause, SkipForward, Shuffle, Plus, Trash2, GripVertical, Search, Filter } from "lucide-react";
import { useState } from "react";

type Track = { id: number; title: string; artist: string; duration: string; ageGroup: string; genre: string; bpm: number };

const allTracks: Track[] = [
  { id: 1, title: "Blinding Lights", artist: "The Weeknd", duration: "3:20", ageGroup: "18–25", genre: "Pop", bpm: 171 },
  { id: 2, title: "Electric Feel", artist: "MGMT", duration: "3:49", ageGroup: "26–35", genre: "Indie", bpm: 120 },
  { id: 3, title: "Take On Me", artist: "a-ha", duration: "3:48", ageGroup: "36–45", genre: "Synth-Pop", bpm: 168 },
  { id: 4, title: "Levitating", artist: "Dua Lipa", duration: "3:23", ageGroup: "18–25", genre: "Pop", bpm: 103 },
  { id: 5, title: "Dreams", artist: "Fleetwood Mac", duration: "4:14", ageGroup: "46+", genre: "Rock", bpm: 120 },
  { id: 6, title: "Circles", artist: "Post Malone", duration: "3:35", ageGroup: "18–25", genre: "Pop", bpm: 120 },
  { id: 7, title: "Superstition", artist: "Stevie Wonder", duration: "4:26", ageGroup: "36–45", genre: "Funk", bpm: 101 },
  { id: 8, title: "Hotel California", artist: "Eagles", duration: "6:30", ageGroup: "46+", genre: "Rock", bpm: 75 },
  { id: 9, title: "Watermelon Sugar", artist: "Harry Styles", duration: "2:54", ageGroup: "18–25", genre: "Pop", bpm: 95 },
  { id: 10, title: "Midnight City", artist: "M83", duration: "4:03", ageGroup: "26–35", genre: "Synth-Pop", bpm: 105 },
  { id: 11, title: "Bohemian Rhapsody", artist: "Queen", duration: "5:55", ageGroup: "46+", genre: "Rock", bpm: 72 },
  { id: 12, title: "Feel Good Inc.", artist: "Gorillaz", duration: "3:41", ageGroup: "26–35", genre: "Alt", bpm: 139 },
];

const ageFilters = ["All", "18–25", "26–35", "36–45", "46+"];

export default function PlaylistPage() {
  const [tracks, setTracks] = useState(allTracks);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("All");
  const [shuffled, setShuffled] = useState(false);

  const filtered = tracks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.artist.toLowerCase().includes(search.toLowerCase());
    const matchAge = ageFilter === "All" || t.ageGroup === ageFilter;
    return matchSearch && matchAge;
  });

  const handleShuffle = () => {
    setTracks(prev => [...prev].sort(() => Math.random() - 0.5));
    setShuffled(true);
    setTimeout(() => setShuffled(false), 600);
  };

  const handleRemove = (id: number) => {
    setTracks(prev => prev.filter(t => t.id !== id));
    if (playingId === id) setPlayingId(null);
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
            <button
              onClick={handleShuffle}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/50 text-xs hover:bg-muted/50 transition-all ${shuffled ? "text-primary border-primary/30" : "text-muted-foreground"}`}
            >
              <Shuffle className={`w-3.5 h-3.5 transition-transform ${shuffled ? "rotate-180" : ""}`} /> Shuffle
            </button>
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
              placeholder="Search tracks or artists..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-border/50 text-sm focus:outline-none focus:border-[hsl(var(--violet))/0.5] transition-colors placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-1.5">
            {ageFilters.map(f => (
              <button
                key={f}
                onClick={() => setAgeFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
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
        {playingId && (() => {
          const t = tracks.find(t => t.id === playingId);
          if (!t) return null;
          return (
            <AnimatedCard delay={0} className="border-[hsl(var(--violet))/0.3] bg-[hsl(var(--violet))/0.03]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[hsl(var(--violet))/0.15] flex items-center justify-center">
                  <div className="flex items-end gap-[2px] h-5">
                    {[0, 1, 2, 3].map(j => (
                      <div key={j} className="w-[3px] rounded-full bg-[hsl(var(--violet))]" style={{ animation: `waveform 0.6s ease-in-out ${j * 0.15}s infinite`, height: "4px", transformOrigin: "bottom" }} />
                    ))}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[hsl(var(--violet))]">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.artist} · {t.genre} · {t.bpm} BPM</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPlayingId(null)} className="p-2 rounded-full hover:bg-muted/50 transition-colors">
                    <Pause className="w-4 h-4 text-[hsl(var(--violet))]" />
                  </button>
                  <button onClick={() => {
                    const idx = filtered.findIndex(t => t.id === playingId);
                    if (idx < filtered.length - 1) setPlayingId(filtered[idx + 1].id);
                  }} className="p-2 rounded-full hover:bg-muted/50 transition-colors">
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </AnimatedCard>
          );
        })()}

        {/* Track List */}
        <AnimatedCard delay={200}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{filtered.length} tracks</p>
            <p className="text-[10px] text-muted-foreground">Click to play · Mapped to age group</p>
          </div>
          <div className="space-y-0.5">
            {filtered.map((track, i) => {
              const isPlaying = playingId === track.id;
              return (
                <div
                  key={track.id}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer group ${
                    isPlaying ? "bg-[hsl(var(--violet))/0.08] border border-[hsl(var(--violet))/0.2]" : "hover:bg-muted/30 border border-transparent"
                  }`}
                  onClick={() => setPlayingId(isPlaying ? null : track.id)}
                  style={{ animation: `float-in 0.4s ease-out ${200 + i * 50}ms forwards`, opacity: 0 }}
                >
                  {/* Play indicator */}
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    {isPlaying ? (
                      <div className="flex items-end gap-[2px] h-3.5">
                        {[0, 1, 2].map(j => (
                          <div key={j} className="w-[3px] rounded-full bg-[hsl(var(--violet))]" style={{ animation: `waveform 0.6s ease-in-out ${j * 0.15}s infinite`, height: "4px", transformOrigin: "bottom" }} />
                        ))}
                      </div>
                    ) : (
                      <Play className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>

                  <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isPlaying ? "text-[hsl(var(--violet))]" : ""}`}>{track.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{track.artist}</p>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground font-mono">{track.genre}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">{track.ageGroup}</span>
                  <span className="text-xs font-mono text-muted-foreground tabular-nums w-10 text-right">{track.duration}</span>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(track.id); }}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </AnimatedCard>
      </div>
    </DashboardLayout>
  );
}
