import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCardProps {
  streak: number;
  className?: string;
}

export function StreakCard({ streak, className }: StreakCardProps) {
  const isHot = streak >= 7;
  const isOnFire = streak >= 30;

  return (
    <div className={cn(
      "relative bg-[#0a0a0a] border border-[rgba(139,92,246,0.12)] p-5 transition-all duration-200",
      "before:absolute before:top-0 before:left-0 before:w-3 before:h-px before:bg-violet-500 before:opacity-60",
      "after:absolute after:top-0 after:left-0 after:w-px after:h-3 after:bg-violet-500 after:opacity-60",
      "hover:border-[rgba(139,92,246,0.28)]",
      className
    )}>
      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#555555] mb-3">Streak</p>
      <div className="flex items-end justify-between">
        <div>
          <span className="font-mono text-3xl font-bold text-[#e8e8e8] leading-none">{streak}</span>
          <span className="font-mono text-[10px] text-[#444444] ml-1">days</span>
        </div>
        <Flame className={cn(
          "h-5 w-5 mb-0.5",
          isOnFire ? "text-red-400" : isHot ? "text-amber-400" : "text-violet-400/50"
        )} />
      </div>
      {streak >= 3 && (
        <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-violet-500/60 mt-2">
          {isOnFire ? "// on fire" : isHot ? "// momentum" : "// active"}
        </p>
      )}
    </div>
  );
}
