import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/actions/profile";
import { getDailyQuests } from "@/lib/actions/quests";
import { getObjectives } from "@/lib/actions/objectives";
import { getWeeklyXpData } from "@/lib/actions/analytics";
import { calculateLevel, calculateXpProgress, getRank, getRankColor } from "@/lib/utils";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profile, dailyQuests, objectives, weeklyXp, skills] = await Promise.all([
    ensureProfile(),
    getDailyQuests(),
    getObjectives(),
    getWeeklyXpData(),
    supabase.from("skills").select("*").eq("user_id", user.id),
  ]);

  if (!profile) redirect("/login");

  const completedToday = dailyQuests.filter((q) => q.status === "completed").length;
  const weeklyXpTotal = weeklyXp.reduce((sum, d) => sum + d.xp, 0);

  return (
    <DashboardClient
      profile={profile}
      dailyQuests={dailyQuests}
      completedToday={completedToday}
      weeklyXp={weeklyXpTotal}
      weeklyXpData={weeklyXp}
      activeObjectives={objectives.filter((o: any) => o.status === "active").slice(0, 3)}
      skills={skills.data || []}
    />
  );
}
