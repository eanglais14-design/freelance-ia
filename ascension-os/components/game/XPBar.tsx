"use client";
import { calculateXpProgress } from "@/lib/utils";

interface XPBarProps {
  totalXp: number;
  showDetails?: boolean;
  className?: string;
}

export function XPBar({ totalXp, showDetails = true, className }: XPBarProps) {
  const { current, required, percentage } = calculateXpProgress(totalXp);
  return (
    <div className={className}>
      {showDetails && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#444]">
            {current.toLocaleString()} / {required.toLocaleString()} xp
          </span>
          <span className="font-mono text-[9px] text-violet-500/70">{percentage}%</span>
        </div>
      )}
      <div className="h-px w-full bg-[rgba(255,255,255,0.06)]">
        <div className="h-px bg-violet-500 transition-all duration-700" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
