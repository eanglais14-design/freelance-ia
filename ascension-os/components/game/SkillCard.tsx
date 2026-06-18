import { Skill } from "@/types";
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
    <div className={cn(
      "relative bg-[#0a0a0a] border border-[rgba(139,92,246,0.12)] p-4 transition-all duration-200",
      "hover:border-[rgba(139,92,246,0.28)]",
      className
    )}>
      {/* Top accent line using domain color */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: color, opacity: 0.4 }} />

      <div className="flex items-center justify-between mb-3">
        <span className="text-base">{icon}</span>
        <span
          className="font-mono text-lg font-bold"
          style={{ color }}
        >
          {level}
        </span>
      </div>

      <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#555555] mb-2 truncate">{label}</p>

      <div className="h-px w-full bg-[rgba(139,92,246,0.08)] mb-1">
        <div
          className="h-px transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: color, opacity: 0.7 }}
        />
      </div>
      <p className="font-mono text-[9px] text-[#444444]">{skill.xp.toLocaleString()} xp</p>
    </div>
  );
}
