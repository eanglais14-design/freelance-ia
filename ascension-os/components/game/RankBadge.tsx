import { getRank, getRankColor, calculateLevel } from "@/lib/utils";
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
  sm: "w-7 h-7 text-[10px]",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-xl",
  xl: "w-20 h-20 text-3xl",
};

const rankColors: Record<string, { text: string; border: string }> = {
  E: { text: "text-[#4b5563]", border: "border-[#4b5563]/40" },
  D: { text: "text-emerald-400", border: "border-emerald-400/40" },
  C: { text: "text-blue-400", border: "border-blue-400/40" },
  B: { text: "text-violet-400", border: "border-violet-400/40" },
  A: { text: "text-amber-400", border: "border-amber-400/40" },
  S: { text: "text-red-400", border: "border-red-400/40" },
};

export function RankBadge({ rank, level, totalXp, size = "md", showLabel = false, className }: RankBadgeProps) {
  const resolvedLevel = level ?? (totalXp != null ? calculateLevel(totalXp) : 1);
  const resolvedRank = rank ?? getRank(resolvedLevel);
  const colors = rankColors[resolvedRank] ?? rankColors.E;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className={cn(
        "flex items-center justify-center font-mono font-bold border",
        "rounded-none bg-[#080808]",
        sizeClasses[size],
        colors.text,
        colors.border
      )}>
        {resolvedRank}
      </div>
      {showLabel && (
        <span className={cn("font-mono text-[9px] tracking-[0.15em] uppercase", colors.text)}>
          rank {resolvedRank}
        </span>
      )}
    </div>
  );
}
