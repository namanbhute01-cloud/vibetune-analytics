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
  color?: "amber" | "teal" | "rose" | "violet";
}

const colorMap = {
  amber: {
    icon: "text-primary",
    iconBg: "bg-primary/10 group-hover:bg-primary/20",
    glow: "glow-amber border-primary/20",
    hoverGlow: "group-hover:bg-primary/5",
  },
  teal: {
    icon: "text-[hsl(var(--info))]",
    iconBg: "bg-[hsl(var(--info)/0.1)] group-hover:bg-[hsl(var(--info)/0.2)]",
    glow: "glow-teal border-[hsl(var(--info)/0.2)]",
    hoverGlow: "group-hover:bg-[hsl(var(--info)/0.05)]",
  },
  rose: {
    icon: "text-[hsl(var(--rose))]",
    iconBg: "bg-[hsl(var(--rose)/0.1)] group-hover:bg-[hsl(var(--rose)/0.2)]",
    glow: "glow-rose border-[hsl(var(--rose)/0.2)]",
    hoverGlow: "group-hover:bg-[hsl(var(--rose)/0.05)]",
  },
  violet: {
    icon: "text-[hsl(var(--violet))]",
    iconBg: "bg-[hsl(var(--violet)/0.1)] group-hover:bg-[hsl(var(--violet)/0.2)]",
    glow: "glow-violet border-[hsl(var(--violet)/0.2)]",
    hoverGlow: "group-hover:bg-[hsl(var(--violet)/0.05)]",
  },
};

export function StatCard({ icon: Icon, label, value, sub, delay = 0, glow, trend, color = "amber" }: StatCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-[hsl(var(--success))]" : trend === "down" ? "text-[hsl(var(--rose))]" : "text-muted-foreground";
  const c = colorMap[color];

  return (
    <AnimatedCard delay={delay} className={cn("group relative overflow-hidden", glow && c.glow)}>
      <div className={cn("absolute -top-8 -right-8 w-24 h-24 rounded-full bg-transparent transition-all duration-500 blur-2xl", c.hoverGlow)} />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2.5 flex items-center gap-2">
            {label}
            {trend && <TrendIcon className={cn("w-3 h-3", trendColor)} />}
          </p>
          <p className="text-4xl font-bold tracking-tighter tabular-nums">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>}
        </div>
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300", c.iconBg)}>
          <Icon className={cn("w-5 h-5", c.icon)} />
        </div>
      </div>
    </AnimatedCard>
  );
}
