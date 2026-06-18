"use client";
import { calculateXpProgress, calculateLevel, getRank, getRankColor, getRankBgColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface XPBarProps {
  totalXp: number;
  showDetails?: boolean;
  className?: string;
}

export function XPBar({ totalXp, showDetails = true, className }: XPBarProps) {
  const level = calculateLevel(totalXp);
  const { current, required, percentage } = calculateXpProgress(totalXp);
  const rank = getRank(level);

  return (
    <div className={cn("space-y-2", className)}>
      {showDetails && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{current.toLocaleString()}</span> / {required.toLocaleString()} XP
          </span>
          <span className="text-muted-foreground">{percentage}%</span>
        </div>
      )}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent ${percentage - 5}%, rgba(139,92,246,0.3) ${percentage}%, transparent ${percentage + 5}%)`,
          }}
        />
      </div>
    </div>
  );
}
