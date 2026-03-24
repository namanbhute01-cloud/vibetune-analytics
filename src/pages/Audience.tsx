import { DashboardLayout } from "@/components/DashboardLayout";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Users, TrendingUp, TrendingDown, Clock, UserCheck, BarChart3 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const hourlyData = [
  { hour: "6pm", count: 12 }, { hour: "7pm", count: 28 }, { hour: "8pm", count: 45 },
  { hour: "9pm", count: 52 }, { hour: "10pm", count: 43 }, { hour: "11pm", count: 31 },
  { hour: "12am", count: 18 },
];

const ageGroups = [
  { range: "18–25", count: 8, pct: 26, color: "hsl(43 96% 56%)" },
  { range: "26–35", count: 14, pct: 45, color: "hsl(173 58% 39%)" },
  { range: "36–45", count: 6, pct: 19, color: "hsl(262 52% 62%)" },
  { range: "46+", count: 3, pct: 10, color: "hsl(346 72% 58%)" },
];

const genderSplit = [
  { label: "Male", pct: 58, color: "hsl(var(--info))" },
  { label: "Female", pct: 38, color: "hsl(var(--rose))" },
  { label: "Other", pct: 4, color: "hsl(var(--violet))" },
];

const recentDetections = [
  { id: "P-001", age: 24, zone: "Bar Area", time: "2m ago" },
  { id: "P-002", age: 31, zone: "Dining Hall", time: "3m ago" },
  { id: "P-003", age: 27, zone: "Entrance", time: "5m ago" },
  { id: "P-004", age: 42, zone: "VIP Lounge", time: "6m ago" },
  { id: "P-005", age: 19, zone: "Terrace", time: "8m ago" },
  { id: "P-006", age: 35, zone: "Bar Area", time: "10m ago" },
];

function useCounter(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { val, ref };
}

export default function AudiencePage() {
  const totalPeople = useCounter(43);
  const avgAge = useCounter(28);
  const peakHour = useCounter(52);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-end justify-between gap-4 pb-2 border-b border-border/30" style={{ animation: "float-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-[hsl(var(--rose))]" />
              <span className="text-xs font-medium text-[hsl(var(--rose))] uppercase tracking-widest">Audience Analytics</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Audience</h1>
            <p className="text-sm text-muted-foreground mt-1">Demographics & real-time crowd intelligence</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AnimatedCard delay={100}>
            <div ref={totalPeople.ref} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[hsl(var(--rose))/0.1] flex items-center justify-center">
                <Users className="w-6 h-6 text-[hsl(var(--rose))]" />
              </div>
              <div>
                <p className="text-3xl font-bold">{totalPeople.val}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="w-3 h-3 text-[hsl(var(--success))]" /> +7 last 10 min</p>
              </div>
            </div>
          </AnimatedCard>
          <AnimatedCard delay={180}>
            <div ref={avgAge.ref} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{avgAge.val}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><TrendingDown className="w-3 h-3 text-primary" /> Avg Age · Trending younger</p>
              </div>
            </div>
          </AnimatedCard>
          <AnimatedCard delay={260}>
            <div ref={peakHour.ref} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[hsl(var(--violet))/0.1] flex items-center justify-center">
                <Clock className="w-6 h-6 text-[hsl(var(--violet))]" />
              </div>
              <div>
                <p className="text-3xl font-bold">{peakHour.val}</p>
                <p className="text-xs text-muted-foreground">Peak at 9 PM</p>
              </div>
            </div>
          </AnimatedCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hourly chart */}
          <AnimatedCard className="lg:col-span-2" delay={300}>
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-4 h-4 text-[hsl(var(--info))]" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Hourly Traffic</p>
            </div>
            <div className="flex items-end gap-3 h-40">
              {hourlyData.map((d, i) => {
                const maxCount = Math.max(...hourlyData.map(h => h.count));
                const height = (d.count / maxCount) * 100;
                return (
                  <div key={d.hour} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">{d.count}</span>
                    <div
                      className="w-full rounded-t-md transition-all duration-500 hover:opacity-80 cursor-pointer"
                      style={{
                        height: `${height}%`,
                        background: `linear-gradient(to top, hsl(var(--info)), hsl(var(--info) / 0.4))`,
                        animation: `float-in 0.6s ease-out ${300 + i * 80}ms forwards`,
                        opacity: 0,
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground font-mono">{d.hour}</span>
                  </div>
                );
              })}
            </div>
          </AnimatedCard>

          {/* Age distribution */}
          <AnimatedCard delay={400}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Age Distribution</p>
            <div className="space-y-3">
              {ageGroups.map((g, i) => (
                <button
                  key={g.range}
                  className={`w-full text-left p-2.5 rounded-lg transition-all duration-200 border ${
                    selectedGroup === g.range
                      ? "border-primary/30 bg-primary/5"
                      : "border-transparent hover:bg-muted/30"
                  }`}
                  onClick={() => setSelectedGroup(selectedGroup === g.range ? null : g.range)}
                  style={{ animation: `float-in 0.4s ease-out ${400 + i * 80}ms forwards`, opacity: 0 }}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium">{g.range}</span>
                    <span className="text-xs font-mono text-muted-foreground">{g.count} ({g.pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${g.pct}%`, backgroundColor: g.color, animationDelay: `${500 + i * 100}ms` }}
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Gender split */}
            <div className="mt-6 pt-4 border-t border-border/30">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Gender Split</p>
              <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                {genderSplit.map(g => (
                  <div
                    key={g.label}
                    className="h-full rounded-full transition-all duration-500 hover:opacity-80 cursor-pointer"
                    style={{ width: `${g.pct}%`, backgroundColor: g.color }}
                    title={`${g.label}: ${g.pct}%`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {genderSplit.map(g => (
                  <span key={g.label} className="text-[10px] text-muted-foreground">{g.label} {g.pct}%</span>
                ))}
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Recent Detections */}
        <AnimatedCard delay={500}>
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="w-4 h-4 text-[hsl(var(--rose))]" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Recent Detections</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">ID</th>
                  <th className="text-left py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Est. Age</th>
                  <th className="text-left py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Zone</th>
                  <th className="text-right py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Detected</th>
                </tr>
              </thead>
              <tbody>
                {recentDetections.map((d, i) => (
                  <tr
                    key={d.id}
                    className="border-b border-border/20 hover:bg-muted/30 transition-colors cursor-pointer"
                    style={{ animation: `float-in 0.4s ease-out ${550 + i * 60}ms forwards`, opacity: 0 }}
                  >
                    <td className="py-2.5 font-mono text-[hsl(var(--info))]">{d.id}</td>
                    <td className="py-2.5">{d.age}</td>
                    <td className="py-2.5 text-muted-foreground">{d.zone}</td>
                    <td className="py-2.5 text-right text-muted-foreground text-xs">{d.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedCard>
      </div>
    </DashboardLayout>
  );
}
