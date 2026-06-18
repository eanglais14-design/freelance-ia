import { Skill } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { getDomainColor, getDomainIcon, getDomainLabel, calculateLevel, calculateXpProgress } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SkillCardProps {
  skill: Skill;
  className?: string;
}

export function SkillCard({ skill, className }: SkillCardProps) {
  const level = calculateLevel(skill.xp);
  const { current, required, percentage } = calculateXpProgress(skill.xp);
  const color = getDomainColor(skill.domain);
  const icon = getDomainIcon(skill.domain);
  const label = getDomainLabel(skill.domain);

  return (
    <Card className={cn("overflow-hidden hover:border-violet-500/20 transition-all duration-200 card-glow", className)}>
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}88, ${color}22)` }} />
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <div>
              <p className="font-medium text-sm">{label}</p>
              <p className="text-xs text-muted-foreground">{skill.xp.toLocaleString()} total XP</p>
            </div>
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold"
            style={{ borderColor: `${color}40`, backgroundColor: `${color}15`, color }}
          >
            {level}
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{current.toLocaleString()} / {required.toLocaleString()} XP</span>
            <span>{percentage}%</span>
          </div>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${percentage}%`, backgroundColor: color }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
