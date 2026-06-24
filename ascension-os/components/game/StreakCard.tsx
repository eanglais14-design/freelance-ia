import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCardProps { streak: number; className?: string; }

export function StreakCard({ streak, className }: StreakCardProps) {
  const isHot = streak >= 7;
  const isLegendary = streak >= 30;
  const status = isLegendary ? "// legendary" : isHot ? "// unstoppable" : streak >= 3 ? "// on_fire" : "// active";

  return (
    <div className={cn("bg-[#080808] p-5", className)}>
      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#555555] mb-3">Streak</p>
      <div className="flex items-end justify-between">
        <div>
          <span className="font-mono text-4xl font-bold text-[#e8e8e8] leading-none">{streak}</span>
          <span className="font-mono text-[10px] text-[#444] ml-1.5">days</span>
        </div>
        <Flame className={cn("h-5 w-5 mb-0.5", isLegendary ? "text-red-400" : isHot ? "text-amber-400" : "text-violet-400/40")} />
      </div>
      <p className="font-mono text-[9px] tracking-[0.12em] text-violet-500/50 mt-2">{status}</p>
    </div>
  );
}
