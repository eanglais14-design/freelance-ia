import { getRank, getRankColor, getRankBgColor, calculateLevel } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RankBadgeProps {
  rank?: string;
  level?: number;
  totalXp?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-lg",
  lg: "w-16 h-16 text-2xl",
  xl: "w-24 h-24 text-4xl",
};

export function RankBadge({ rank, level, totalXp, size = "md", showLabel = false, className }: RankBadgeProps) {
  const resolvedLevel = level ?? (totalXp != null ? calculateLevel(totalXp) : 1);
  const resolvedRank = rank ?? getRank(resolvedLevel);
  const colorClass = getRankColor(resolvedRank);
  const bgClass = getRankBgColor(resolvedRank);

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border-2 font-bold",
          sizeClasses[size],
          bgClass,
          colorClass
        )}
      >
        {resolvedRank}
      </div>
      {showLabel && (
        <span className={cn("text-xs font-medium", colorClass)}>
          Rank {resolvedRank}
        </span>
      )}
    </div>
  );
}
