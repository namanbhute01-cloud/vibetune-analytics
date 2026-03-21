import { AnimatedCard } from "./AnimatedCard";
import { Users } from "lucide-react";

interface AgeGaugeProps {
  avgAge: number;
  ageBreakdown: { range: string; count: number; color: string }[];
  delay?: number;
}

export function AgeGauge({ avgAge, ageBreakdown, delay = 0 }: AgeGaugeProps) {
  const total = ageBreakdown.reduce((s, b) => s + b.count, 0);

  return (
    <AnimatedCard delay={delay}>
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-4 h-4 text-primary" />
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Age Distribution</p>
      </div>

      {/* Average age circle */}
      <div className="flex items-center gap-6 mb-5">
        <div className="w-20 h-20 rounded-full border-2 border-primary/30 flex flex-col items-center justify-center glow-amber-sm">
          <span className="text-2xl font-bold tabular-nums text-primary">{avgAge}</span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Avg Age</span>
        </div>
        <div className="flex-1 space-y-2">
          {ageBreakdown.map((group) => (
            <div key={group.range} className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground w-12 shrink-0">{group.range}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${total ? (group.count / total) * 100 : 0}%`,
                    backgroundColor: group.color,
                  }}
                />
              </div>
              <span className="text-[11px] tabular-nums text-muted-foreground w-6 text-right">{group.count}</span>
            </div>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
}
