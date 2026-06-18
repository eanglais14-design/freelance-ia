"use client";
import { useState } from "react";
import { Check, Clock, Zap, Coins, ChevronRight, Trophy } from "lucide-react";
import { Quest } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDomainColor, getDomainIcon, getDomainLabel, cn } from "@/lib/utils";

interface QuestCardProps {
  quest: Quest;
  onComplete?: (questId: string) => void;
  onSkip?: (questId: string) => void;
  compact?: boolean;
}

const difficultyConfig = {
  easy: { label: "Easy", variant: "easy" as const, xp: 25 },
  medium: { label: "Medium", variant: "medium" as const, xp: 50 },
  hard: { label: "Hard", variant: "hard" as const, xp: 100 },
  boss: { label: "Boss", variant: "boss" as const, xp: 250 },
};

export function QuestCard({ quest, onComplete, onSkip, compact = false }: QuestCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const domainColor = getDomainColor(quest.domain);
  const domainIcon = getDomainIcon(quest.domain);
  const diff = difficultyConfig[quest.difficulty];

  const handleComplete = async () => {
    if (quest.status === "completed" || isCompleting) return;
    setIsCompleting(true);
    await onComplete?.(quest.id);
    setIsCompleting(false);
  };

  const isCompleted = quest.status === "completed";
  const isSkipped = quest.status === "skipped";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border transition-all duration-200",
        isCompleted
          ? "border-green-500/20 bg-green-500/5 opacity-75"
          : isSkipped
          ? "border-border opacity-50"
          : "hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 card-glow"
      )}
    >
      <div
        className="absolute left-0 top-0 h-full w-1 transition-all duration-200"
        style={{ backgroundColor: isCompleted ? "#22c55e" : domainColor, opacity: isCompleted ? 1 : 0.7 }}
      />
      <CardContent className={cn("pl-5", compact ? "py-3" : "py-4")}>
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-base">{domainIcon}</span>
              <h3
                className={cn(
                  "font-medium text-sm leading-tight",
                  isCompleted && "line-through text-muted-foreground"
                )}
              >
                {quest.title}
              </h3>
              {quest.difficulty === "boss" && (
                <Trophy className="h-3.5 w-3.5 text-red-400" />
              )}
            </div>
            {!compact && quest.description && (
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{quest.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={diff.variant} className="text-xs">{diff.label}</Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Zap className="h-3 w-3 text-violet-400" />
                {quest.xp_reward} XP
              </span>
              {quest.coin_reward > 0 && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Coins className="h-3 w-3 text-amber-400" />
                  {quest.coin_reward}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {!isCompleted && !isSkipped && onComplete && (
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "h-8 w-8 rounded-full border transition-all duration-200",
                  "border-border hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400"
                )}
                onClick={handleComplete}
                disabled={isCompleting}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            {isCompleted && (
              <div className="h-8 w-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <Check className="h-4 w-4 text-green-400" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
