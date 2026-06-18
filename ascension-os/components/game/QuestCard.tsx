"use client";
import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { Quest } from "@/types";
import { getDomainColor, getDomainIcon, cn } from "@/lib/utils";

interface QuestCardProps {
  quest: Quest;
  onComplete?: (questId: string) => void;
  onSkip?: (questId: string) => void;
  compact?: boolean;
}

const difficultyLabel: Record<string, string> = {
  easy: "E", medium: "M", hard: "H", boss: "B",
};

const difficultyColor: Record<string, string> = {
  easy: "#555555", medium: "#8b5cf6", hard: "#7c3aed", boss: "#ef4444",
};

export function QuestCard({ quest, onComplete, compact = false }: QuestCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const domainColor = getDomainColor(quest.domain);
  const domainIcon = getDomainIcon(quest.domain);
  const isCompleted = quest.status === "completed";
  const isSkipped = quest.status === "skipped";

  const handleComplete = async () => {
    if (isCompleted || isCompleting) return;
    setIsCompleting(true);
    await onComplete?.(quest.id);
    setIsCompleting(false);
  };

  return (
    <div className={cn(
      "relative flex items-center gap-3 px-4 py-3 border-b border-[rgba(139,92,246,0.07)] transition-all duration-150",
      !isCompleted && !isSkipped && "hover:bg-[rgba(139,92,246,0.03)] cursor-default",
      isCompleted && "opacity-40",
      isSkipped && "opacity-25",
    )}>
      {/* Domain color left rule */}
      <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: domainColor, opacity: isCompleted ? 0.3 : 0.5 }} />

      {/* Domain icon */}
      <span className="text-sm shrink-0 ml-1">{domainIcon}</span>

      {/* Quest title */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-mono text-xs text-[#e8e8e8] truncate",
          isCompleted && "line-through text-[#444444]"
        )}>
          {quest.title}
        </p>
        {!compact && quest.description && (
          <p className="font-mono text-[9px] text-[#444444] mt-0.5 truncate">{quest.description}</p>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 shrink-0">
        <span
          className="font-mono text-[9px] tracking-[0.1em] uppercase"
          style={{ color: difficultyColor[quest.difficulty] }}
        >
          [{difficultyLabel[quest.difficulty]}]
        </span>
        <span className="font-mono text-[9px] text-violet-500/60">+{quest.xp_reward}</span>

        {/* Complete button */}
        {!isCompleted && !isSkipped && onComplete && (
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="w-5 h-5 border border-[rgba(139,92,246,0.25)] flex items-center justify-center hover:border-violet-500 hover:bg-violet-500/10 transition-all"
          >
            <Check className="h-2.5 w-2.5 text-[#555555] hover:text-violet-400" />
          </button>
        )}
        {isCompleted && (
          <div className="w-5 h-5 border border-violet-500/40 bg-violet-500/10 flex items-center justify-center">
            <Check className="h-2.5 w-2.5 text-violet-400" />
          </div>
        )}
      </div>
    </div>
  );
}
