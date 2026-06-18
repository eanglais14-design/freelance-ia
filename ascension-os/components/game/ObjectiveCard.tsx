"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { Objective } from "@/types";
import { getDomainColor, getDomainIcon, cn } from "@/lib/utils";

interface ObjectiveCardProps {
  objective: Objective;
  onMilestoneComplete?: (milestoneId: string) => void;
  className?: string;
}

export function ObjectiveCard({ objective, onMilestoneComplete, className }: ObjectiveCardProps) {
  const [expanded, setExpanded] = useState(false);
  const milestones = objective.milestones ?? [];
  const completed = milestones.filter((m) => m.status === "completed").length;
  const total = milestones.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const color = getDomainColor(objective.domain);
  const icon = getDomainIcon(objective.domain);

  return (
    <div className={cn(
      "relative bg-[#0a0a0a] border border-[rgba(139,92,246,0.12)] transition-all duration-200",
      "before:absolute before:top-0 before:left-0 before:w-3 before:h-px before:opacity-60",
      "after:absolute after:top-0 after:left-0 after:w-px after:h-3 after:opacity-60",
      "hover:border-[rgba(139,92,246,0.28)]",
      className
    )}
    style={{
      "--tw-before-bg": color,
      "--tw-after-bg": color,
    } as any}>
      {/* Top domain color line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: color, opacity: 0.25 }} />

      <button
        className="w-full flex items-start gap-3 p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-base mt-0.5 shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs text-[#e8e8e8] mb-1">{objective.title}</p>
          {total > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-[#444444]">{completed}/{total} milestones</span>
                <span className="font-mono text-[9px] text-violet-500/60">{progress}%</span>
              </div>
              <div className="h-px bg-[rgba(139,92,246,0.08)]">
                <div className="h-px transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: color, opacity: 0.6 }} />
              </div>
            </div>
          )}
        </div>
        <div className="shrink-0 mt-0.5">
          {expanded
            ? <ChevronUp className="h-3 w-3 text-[#444444]" />
            : <ChevronDown className="h-3 w-3 text-[#444444]" />}
        </div>
      </button>

      {expanded && milestones.length > 0 && (
        <div className="border-t border-[rgba(139,92,246,0.07)] px-4 pb-3 pt-2 space-y-1.5">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="flex items-center gap-2">
              <button
                onClick={() => milestone.status === "pending" && onMilestoneComplete?.(milestone.id)}
                className={cn(
                  "w-3.5 h-3.5 border flex items-center justify-center shrink-0 transition-all",
                  milestone.status === "completed"
                    ? "border-violet-500/40 bg-violet-500/10"
                    : "border-[rgba(139,92,246,0.2)] hover:border-violet-500/50"
                )}
              >
                {milestone.status === "completed" && <Check className="h-2 w-2 text-violet-400" />}
              </button>
              <span className={cn(
                "font-mono text-[10px]",
                milestone.status === "completed" ? "text-[#444444] line-through" : "text-[#888888]"
              )}>
                {milestone.title}
              </span>
              {milestone.xp_reward > 0 && (
                <span className="font-mono text-[9px] text-violet-500/50 ml-auto">+{milestone.xp_reward}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
