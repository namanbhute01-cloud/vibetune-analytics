import { cn } from "@/lib/utils";
import { AnimatedCard } from "./AnimatedCard";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  delay?: number;
  glow?: boolean;
}

export function StatCard({ icon: Icon, label, value, sub, delay = 0, glow }: StatCardProps) {
  return (
    <AnimatedCard delay={delay} className={cn(glow && "glow-amber border-primary/20")}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </AnimatedCard>
  );
}
