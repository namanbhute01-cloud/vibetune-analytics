import { DashboardLayout } from "@/components/DashboardLayout";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Settings as SettingsIcon, Camera, Music, Wifi, Shield, Save, RotateCcw, Eye, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useVibeStream } from "@/hooks/useVibeStream";

type EnvVar = { key: string; value: string; masked: boolean; category: string };

const categories = [
  { id: "cameras", label: "Camera Config", icon: Camera, color: "info" },
  { id: "detection", label: "Detection AI", icon: Shield, color: "rose" },
  { id: "music", label: "Music API", icon: Music, color: "violet" },
  { id: "system", label: "System", icon: Wifi, color: "primary" },
];

type ToggleSetting = { label: string; description: string; key: string; default: boolean };

const toggleSettings: ToggleSetting[] = [
  { label: "Auto-adjust playlist", description: "Automatically change songs based on real-time age detection", key: "auto_playlist", default: true },
  { label: "Face detection overlay", description: "Show bounding boxes on camera feeds", key: "face_overlay", default: true },
  { label: "Shuffle mode", description: "Play songs in random order within age group", key: "shuffle_mode", default: true },
  { label: "Privacy mode", description: "Blur faces in the dashboard feed display", key: "privacy_mode", default: false },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${enabled ? "bg-primary" : "bg-muted"}`}>
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-foreground transition-transform duration-200 ${enabled ? "translate-x-5 bg-primary-foreground" : ""}`} />
    </button>
  );
}

export default function SettingsPage() {
  const vibeState = useVibeStream();
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("cameras");
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(toggleSettings.map(s => [s.key, s.default]))
  );
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load env vars from backend (simulated for now - would need actual endpoint)
  useEffect(() => {
    // In production, fetch from /api/config/env
    const mockEnvVars: EnvVar[] = [
      { key: "API_HOST", value: "0.0.0.0", masked: false, category: "system" },
      { key: "API_PORT", value: "8080", masked: false, category: "system" },
      { key: "DEBUG", value: "true", masked: false, category: "system" },
      { key: "CAMERA_SOURCES", value: "0", masked: false, category: "cameras" },
      { key: "TARGET_HEIGHT", value: "720", masked: false, category: "cameras" },
      { key: "FRAME_RATE_LIMIT", value: "15", masked: false, category: "cameras" },
      { key: "FACE_DETECTION_CONF", value: "0.5", masked: false, category: "detection" },
      { key: "PERSON_DETECTION_CONF", value: "0.4", masked: false, category: "detection" },
      { key: "FACE_SIMILARITY_THRESHOLD", value: "0.65", masked: false, category: "detection" },
      { key: "ROOT_MUSIC_DIR", value: "./OfflinePlayback", masked: false, category: "music" },
      { key: "DEFAULT_VOLUME", value: "70", masked: false, category: "music" },
      { key: "SHUFFLE_MODE", value: "true", masked: false, category: "music" },
      { key: "GDRIVE_FOLDER_ID", value: "your_google_drive_folder_id_here", masked: true, category: "system" },
    ];
    setEnvVars(mockEnvVars);
    setLoading(false);
  }, []);

  const filteredVars = envVars.filter(v => v.category === activeCategory);

  const startEdit = (env: EnvVar) => {
    setEditingKey(env.key);
    setEditValue(env.value);
  };

  const saveEdit = () => {
    if (!editingKey) return;
    setEnvVars(prev => prev.map(v => v.key === editingKey ? { ...v, value: editValue } : v));
    setEditingKey(null);
    toast.success(`${editingKey} updated`);
    // In production: POST to /api/config/env
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue("");
  };

  const toggleReveal = (key: string) => {
    setRevealedKeys(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleSaveAll = () => {
    toast.success("Settings saved", { description: "Configuration updated" });
    // In production: POST to /api/config/save
  };

  const handleReset = () => {
    setToggles(Object.fromEntries(toggleSettings.map(s => [s.key, s.default])));
    toast.info("Settings reset to defaults");
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-end justify-between gap-4 pb-2 border-b border-border/30" style={{ animation: "float-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-widest">Configuration</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Environment variables, preferences & system config</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/50 text-xs text-muted-foreground hover:bg-muted/50 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button onClick={handleSaveAll} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-colors">
              <Save className="w-3.5 h-3.5" /> Save All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Env Variables */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3" style={{ animation: "float-in 0.5s ease-out 100ms forwards", opacity: 0 }}>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Environment Variables</h2>
              <div className="flex-1 h-px bg-border/30" />
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap" style={{ animation: "float-in 0.5s ease-out 150ms forwards", opacity: 0 }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeCategory === cat.id
                      ? `bg-[hsl(var(--${cat.color}))/0.12] text-[hsl(var(--${cat.color}))] border border-[hsl(var(--${cat.color}))/0.3]`
                      : "text-muted-foreground border border-border/50 hover:bg-muted/30"
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Var list */}
            <AnimatedCard delay={200}>
              {loading ? (
                <div className="py-8 text-center text-muted-foreground">Loading configuration...</div>
              ) : (
                <div className="space-y-1">
                  {filteredVars.map((env, i) => {
                    const isEditing = editingKey === env.key;
                    const isRevealed = revealedKeys.has(env.key);
                    const displayValue = env.masked && !isRevealed ? "•".repeat(16) : env.value;

                    return (
                      <div
                        key={env.key}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${isEditing ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/30 border border-transparent"}`}
                        style={{ animation: `float-in 0.4s ease-out ${200 + i * 60}ms forwards`, opacity: 0 }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono font-medium text-[hsl(var(--info))]">{env.key}</p>
                          {isEditing ? (
                            <div className="flex gap-2 mt-1.5">
                              <input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1 text-sm bg-card border border-border/50 rounded px-2 py-1 font-mono focus:outline-none focus:border-primary/50"
                                autoFocus
                              />
                              <button onClick={saveEdit} className="p-1 rounded hover:bg-[hsl(var(--success))]/20 text-[hsl(var(--success))] transition-colors"><Check className="w-4 h-4" /></button>
                              <button onClick={cancelEdit} className="p-1 rounded hover:bg-destructive/20 text-destructive transition-colors"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground font-mono truncate mt-0.5">{displayValue}</p>
                          )}
                        </div>
                        {!isEditing && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            {env.masked && (
                              <button onClick={() => toggleReveal(env.key)} className="p-1 rounded hover:bg-muted/50 transition-colors text-muted-foreground">
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button onClick={() => startEdit(env)} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted/50">
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </AnimatedCard>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <div className="flex items-center gap-3" style={{ animation: "float-in 0.5s ease-out 200ms forwards", opacity: 0 }}>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Preferences</h2>
              <div className="flex-1 h-px bg-border/30" />
            </div>

            <AnimatedCard delay={300}>
              <div className="space-y-1">
                {toggleSettings.map((setting, i) => (
                  <div
                    key={setting.key}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/30 transition-colors"
                    style={{ animation: `float-in 0.4s ease-out ${300 + i * 60}ms forwards`, opacity: 0 }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{setting.label}</p>
                      <p className="text-[11px] text-muted-foreground">{setting.description}</p>
                    </div>
                    <Toggle
                      enabled={toggles[setting.key]}
                      onChange={() => setToggles(prev => ({ ...prev, [setting.key]: !prev[setting.key] }))}
                    />
                  </div>
                ))}
              </div>
            </AnimatedCard>

            {/* System info */}
            <AnimatedCard delay={450}>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-[hsl(var(--success))]" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground">System Status</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-muted-foreground">Backend Status</span>
                  <span className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--success))]" />
                    {vibeState?.status || "Connected"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-muted-foreground">Current Vibe</span>
                  <span className="font-mono text-xs">{vibeState?.current_vibe || "Unknown"}</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-muted-foreground">Detected Group</span>
                  <span className="font-mono text-xs capitalize">{vibeState?.detected_group || "None"}</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-muted-foreground">Music Engine</span>
                  <span className="font-mono text-xs">{vibeState?.is_playing ? "Playing" : "Idle"}</span>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
