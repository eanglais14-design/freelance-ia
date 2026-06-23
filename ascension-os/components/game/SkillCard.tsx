import { Skill } from "@/types";
import { getDomainColor, getDomainIcon, getDomainLabel, calculateLevel, calculateXpProgress, cn } from "@/lib/utils";

interface SkillCardProps { skill: Skill; className?: string; }

export function SkillCard({ skill, className }: SkillCardProps) {
  const level = calculateLevel(skill.xp);
  const { percentage } = calculateXpProgress(skill.xp);
  const color = getDomainColor(skill.domain);
  const icon = getDomainIcon(skill.domain);
  const label = getDomainLabel(skill.domain);

  return (
    <div className={cn("relative bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] p-3 hover:border-[rgba(255,255,255,0.1)] transition-colors", className)}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: color, opacity: 0.5 }} />
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm">{icon}</span>
        <span className="font-mono text-xs font-bold" style={{ color }}>{level}</span>
      </div>
      <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#555] mb-2 truncate">{label}</p>
      <div className="h-px w-full bg-[rgba(255,255,255,0.05)]">
        <div className="h-px transition-all duration-700" style={{ width: `${percentage}%`, backgroundColor: color, opacity: 0.8 }} />
      </div>
      <p className="font-mono text-[8px] text-[#333] mt-1.5">{skill.xp.toLocaleString()} xp</p>
    </div>
  );
}
