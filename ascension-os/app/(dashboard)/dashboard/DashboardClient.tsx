"use client";
import { useState } from "react";
import { Profile, Quest, Objective, Skill } from "@/types";
import { XPBar } from "@/components/game/XPBar";
import { RankBadge } from "@/components/game/RankBadge";
import { StreakCard } from "@/components/game/StreakCard";
import { QuestCard } from "@/components/game/QuestCard";
import { SkillCard } from "@/components/game/SkillCard";
import { ObjectiveCard } from "@/components/game/ObjectiveCard";
import { WeeklyChart } from "@/components/game/WeeklyChart";
import { VitruvianAvatar } from "@/components/game/VitruvianAvatar";
import { completeQuest } from "@/lib/actions/quests";
import { completeMilestone } from "@/lib/actions/objectives";
import { calculateLevel, calculateXpProgress, getRank } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";
import { BADGE_DEFS } from "@/lib/badges";

interface Props {
  profile: Profile;
  dailyQuests: Quest[];
  completedToday: number;
  weeklyXp: number;
  weeklyXpData: { day: string; xp: number }[];
  activeObjectives: Objective[];
  skills: Skill[];
}

export function DashboardClient({ profile, dailyQuests, completedToday, weeklyXp, weeklyXpData, activeObjectives, skills }: Props) {
  const [quests, setQuests] = useState(dailyQuests);
  const [currentProfile, setCurrentProfile] = useState(profile);

  const level = calculateLevel(currentProfile.total_xp);
  const { current, required, percentage } = calculateXpProgress(currentProfile.total_xp);
  const rank = getRank(level);
  const completedQuests = quests.filter((q) => q.status === "completed").length;
  const allComplete = completedQuests === quests.length && quests.length > 0;

  const handleCompleteQuest = async (questId: string) => {
    const result = await completeQuest(questId);
    if (result.success) {
      setQuests((prev) => prev.map((q) => q.id === questId ? { ...q, status: "completed" as const } : q));
      setCurrentProfile((prev) => ({ ...prev, total_xp: prev.total_xp + (result.xp || 0) }));
      toast({ title: `+${result.xp} XP`, description: "Quest completed!", variant: "success" });
      if (result.newBadges && result.newBadges.length > 0) {
        result.newBadges.forEach((key) => {
          const def = BADGE_DEFS[key as keyof typeof BADGE_DEFS];
          if (def) toast({ title: `${def.icon} ${def.label}`, description: def.description, variant: "success" });
        });
      }
    }
  };

  const handleCompleteMilestone = async (milestoneId: string) => {
    await completeMilestone(milestoneId);
    toast({ title: "Milestone completed!", variant: "success" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#444] mb-1">// ascension_os · dashboard</p>
          <h1 className="font-mono text-xl font-bold text-[#e8e8e8] tracking-tight">
            {currentProfile.username}<span className="text-violet-500">_</span>
          </h1>
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#333] mt-0.5">
            {allComplete
              ? "all_quests_complete · +100_bonus_xp"
              : `${completedQuests}/${quests.length} quests · today`}
          </p>
        </div>
        <VitruvianAvatar className="w-16 h-20 shrink-0 opacity-60" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(255,255,255,0.03)]">
        <div className="bg-[#080808] p-5">
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#555] mb-3">Level · Rank</p>
          <div className="flex items-end gap-3 mb-3">
            <span className="font-mono text-4xl font-bold text-[#e8e8e8] leading-none">{level}</span>
            <RankBadge rank={rank} size="sm" />
          </div>
          <XPBar totalXp={currentProfile.total_xp} showDetails={false} />
        </div>
        <div className="bg-[#080808] p-5">
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#555] mb-3">Total XP</p>
          <p className="font-mono text-4xl font-bold text-[#e8e8e8] leading-none">{currentProfile.total_xp.toLocaleString()}</p>
          <p className="font-mono text-[9px] text-[#333] mt-1">xp accumulated</p>
        </div>
        <div className="bg-[#080808] p-5">
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#555] mb-3">Weekly XP</p>
          <p className="font-mono text-4xl font-bold text-[#e8e8e8] leading-none">{weeklyXp.toLocaleString()}</p>
          <p className="font-mono text-[9px] text-[#333] mt-1">this week</p>
        </div>
        <StreakCard streak={currentProfile.streak} />
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] lg:col-span-2">
          <div className="px-5 pt-5 pb-2">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#444]">// xp_per_day · week</p>
          </div>
          <div className="px-2 pb-4">
            <WeeklyChart data={weeklyXpData} />
          </div>
        </div>
        <div className="lg:col-span-3 bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.04)]">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#444]">// daily_quests</p>
            {allComplete && (
              <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-violet-400">complete · +100xp</span>
            )}
          </div>
          <div>
            {quests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onComplete={handleCompleteQuest} compact />
            ))}
          </div>
        </div>
      </div>

      {activeObjectives.length > 0 && (
        <div>
          <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#444] mb-3">// active_objectives</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeObjectives.map((obj) => (
              <ObjectiveCard key={obj.id} objective={obj as any} onMilestoneComplete={handleCompleteMilestone} />
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#444] mb-3">// domain_skills</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-px bg-[rgba(255,255,255,0.02)]">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill as any} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
