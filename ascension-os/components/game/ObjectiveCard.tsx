"use client";
import { useState } from "react";
import { Target, ChevronDown, ChevronUp, Check, Circle } from "lucide-react";
import { Objective, Milestone } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDomainColor, getDomainIcon, getDomainLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

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
    <Card className={cn("overflow-hidden card-glow hover:border-violet-500/20 transition-all", className)}>
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${color}88, transparent)` }} />
      <CardContent className="p-4">
        <div
          className="flex items-start gap-3 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="text-xl mt-0.5">{icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium text-sm">{objective.title}</h3>
              <Badge variant={objective.status === "completed" ? "easy" : "outline"} className="text-xs">
                {objective.status}
              </Badge>
            </div>
            {objective.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{objective.description}</p>
            )}
            {total > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{completed}/{total} milestones</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="shrink-0">
            {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>
        </div>
        {expanded && milestones.length > 0 && (
          <div className="mt-3 space-y-2 border-t border-border pt-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center gap-2 group/milestone"
              >
                <button
                  onClick={() => milestone.status === "pending" && onMilestoneComplete?.(milestone.id)}
                  className={cn(
                    "h-5 w-5 rounded-full border flex items-center justify-center transition-all shrink-0",
                    milestone.status === "completed"
                      ? "border-green-500/50 bg-green-500/15"
                      : "border-border hover:border-green-500/50 hover:bg-green-500/10"
                  )}
                >
                  {milestone.status === "completed" ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <Circle className="h-3 w-3 text-muted-foreground opacity-0 group-hover/milestone:opacity-100" />
                  )}
                </button>
                <span className={cn(
                  "text-xs",
                  milestone.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"
                )}>
                  {milestone.title}
                </span>
                {milestone.xp_reward > 0 && (
                  <span className="text-xs text-violet-400 ml-auto">+{milestone.xp_reward} XP</span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
