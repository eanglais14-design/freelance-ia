"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { Quest } from "@/types";
import { getDomainColor, getDomainIcon, cn } from "@/lib/utils";

interface QuestCardProps {
  quest: Quest;
  onComplete?: (questId: string) => void;
  onSkip?: (questId: string) => void;
  compact?: boolean;
}

const diffLabel: Record<string, { code: string; color: string }> = {
  easy:   { code: "E", color: "#555555" },
  medium: { code: "M", color: "#8b5cf6" },
  hard:   { code: "H", color: "#7c3aed" },
  boss:   { code: "B", color: "#ef4444" },
};

export function QuestCard({ quest, onComplete, compact = false }: QuestCardProps) {
  const [completing, setCompleting] = useState(false);
  const domainColor = getDomainColor(quest.domain);
  const domainIcon = getDomainIcon(quest.domain);
  const done = quest.status === "completed";
  const skipped = quest.status === "skipped";
  const diff = diffLabel[quest.difficulty] ?? { code: "?", color: "#555" };

  const handleComplete = async () => {
    if (done || completing) return;
    setCompleting(true);
    await onComplete?.(quest.id);
    setCompleting(false);
  };

  return (
    <div className={cn(
      "relative flex items-center gap-3 px-4 py-2.5 border-b border-[rgba(255,255,255,0.04)] transition-all duration-150",
      !done && !skipped && "hover:bg-[rgba(255,255,255,0.02)]",
      (done || skipped) && "opacity-40",
    )}>
      <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: domainColor, opacity: done ? 0.2 : 0.5 }} />
      <span className="text-sm shrink-0 ml-1">{domainIcon}</span>
      <div className="flex-1 min-w-0">
        <p className={cn("font-mono text-[11px] text-[#ccc] truncate", done && "line-through text-[#444]")}>
          {quest.title}
        </p>
        {!compact && quest.description && (
          <p className="font-mono text-[9px] text-[#444] mt-0.5 truncate">{quest.description}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-[9px] tracking-[0.08em]" style={{ color: diff.color }}>[{diff.code}]</span>
        <span className="font-mono text-[9px] text-violet-500/50">+{quest.xp_reward}</span>
        {!done && !skipped && onComplete && (
          <button
            onClick={handleComplete}
            disabled={completing}
            className="w-4 h-4 border border-[rgba(255,255,255,0.15)] flex items-center justify-center hover:border-violet-500/60 transition-colors"
          >
            {completing && <span className="w-1.5 h-1.5 bg-violet-500/50" />}
          </button>
        )}
        {done && (
          <div className="w-4 h-4 border border-violet-500/40 bg-violet-500/10 flex items-center justify-center">
            <Check className="h-2 w-2 text-violet-400" />
          </div>
        )}
      </div>
    </div>
  );
}
