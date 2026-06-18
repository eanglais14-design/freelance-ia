"use client";
import { calculateXpProgress, calculateLevel, getRank } from "@/lib/utils";

interface XPBarProps {
  totalXp: number;
  showDetails?: boolean;
  className?: string;
}

export function XPBar({ totalXp, showDetails = true, className }: XPBarProps) {
  const level = calculateLevel(totalXp);
  const { current, required, percentage } = calculateXpProgress(totalXp);

  return (
    <div className={className}>
      {showDetails && (
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#444444]">
            {current.toLocaleString()} / {required.toLocaleString()} xp
          </span>
          <span className="font-mono text-[9px] text-violet-500">{percentage}%</span>
        </div>
      )}
      <div className="h-px w-full bg-[rgba(139,92,246,0.1)]">
        <div
          className="h-px bg-violet-500 transition-all duration-700"
          style={{
            width: `${percentage}%`,
            boxShadow: "0 0 6px rgba(139,92,246,0.5)",
          }}
        />
      </div>
    </div>
  );
}
