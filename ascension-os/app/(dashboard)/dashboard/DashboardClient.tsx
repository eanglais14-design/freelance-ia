"use client";
import { useState } from "react";
import { Zap, Coins, Star, TrendingUp, CheckCircle2, Award } from "lucide-react";
import { Profile, Quest, Objective, Skill } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XPBar } from "@/components/game/XPBar";
import { RankBadge } from "@/components/game/RankBadge";
import { StreakCard } from "@/components/game/StreakCard";
import { QuestCard } from "@/components/game/QuestCard";
import { SkillCard } from "@/components/game/SkillCard";
import { ObjectiveCard } from "@/components/game/ObjectiveCard";
import { WeeklyChart } from "@/components/game/WeeklyChart";
import { completeQuest } from "@/lib/actions/quests";
import { completeMilestone } from "@/lib/actions/objectives";
import { calculateLevel, calculateXpProgress, getRank } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";

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
  const { percentage } = calculateXpProgress(currentProfile.total_xp);
  const rank = getRank(level);

  const handleCompleteQuest = async (questId: string) => {
    const result = await completeQuest(questId);
    if (result.success) {
      setQuests((prev) => prev.map((q) => q.id === questId ? { ...q, status: "completed" as const } : q));
      setCurrentProfile((prev) => ({ ...prev, total_xp: prev.total_xp + (result.xp || 0) }));
      toast({ title: `+${result.xp} XP`, description: "Quest completed!", variant: "success" });
    }
  };

  const handleCompleteMilestone = async (milestoneId: string) => {
    await completeMilestone(milestoneId);
    toast({ title: "Milestone completed!", variant: "success" });
  };

  const totalDailyQuests = quests.length;
  const completedQuests = quests.filter((q) => q.status === "completed").length;
  const allComplete = completedQuests === totalDailyQuests && totalDailyQuests > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, <span className="text-gradient">{currentProfile.username}</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {allComplete ? "All daily quests complete! 🔥" : `${completedQuests}/${totalDailyQuests} quests completed today`}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="card-glow col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Level & Rank</p>
              <RankBadge rank={rank} size="sm" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{level}</span>
              <span className="text-sm text-muted-foreground">/ ∞</span>
            </div>
            <div className="mt-2">
              <XPBar totalXp={currentProfile.total_xp} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Total XP</p>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-violet-400" />
              <span className="text-2xl font-bold">{currentProfile.total_xp.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Weekly XP</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-2xl font-bold">{weeklyXp.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <StreakCard streak={currentProfile.streak} />
      </div>

      {/* Weekly Chart + Daily Quests */}
      <div className="grid lg:grid-cols-5 gap-4">
        <Card className="card-glow lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Weekly XP</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyChart data={weeklyXpData} />
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Daily Quests</h2>
            {allComplete && (
              <span className="flex items-center gap-1 text-xs text-green-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                All complete! +100 bonus XP
              </span>
            )}
          </div>
          <div className="space-y-2">
            {quests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onComplete={handleCompleteQuest} compact />
            ))}
          </div>
        </div>
      </div>

      {/* Objectives */}
      {activeObjectives.length > 0 && (
        <div>
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Active Objectives</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeObjectives.map((obj) => (
              <ObjectiveCard key={obj.id} objective={obj as any} onMilestoneComplete={handleCompleteMilestone} />
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill as any} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
