import { cn } from "@/lib/utils";
import { AnimatedCard } from "./AnimatedCard";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  delay?: number;
  glow?: boolean;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({ icon: Icon, label, value, sub, delay = 0, glow, trend }: StatCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-[hsl(var(--success))]" : trend === "down" ? "text-primary" : "text-muted-foreground";

  return (
    <AnimatedCard delay={delay} className={cn("group relative overflow-hidden", glow && "glow-amber border-primary/20")}>
      {/* Ambient background glow on hover */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/0 group-hover:bg-primary/5 transition-all duration-500 blur-2xl" />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2.5 flex items-center gap-2">
            {label}
            {trend && <TrendIcon className={cn("w-3 h-3", trendColor)} />}
          </p>
          <p className="text-4xl font-bold tracking-tighter tabular-nums">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </AnimatedCard>
  );
}
