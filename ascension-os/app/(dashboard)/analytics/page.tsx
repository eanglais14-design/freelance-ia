import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getWeeklyXpData, getAnalyticsData } from "@/lib/actions/analytics";
import { AnalyticsClient } from "./AnalyticsClient";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [weeklyXp, analytics] = await Promise.all([getWeeklyXpData(), getAnalyticsData()]);

  // Build 30-day XP curve
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10);
  });

  const { data: xpLogsData } = await supabase
    .from("xp_logs")
    .select("created_at, xp_gained")
    .eq("user_id", user.id)
    .gte("created_at", thirtyDaysAgo);

  const { data: profileData } = await supabase
    .from("profiles")
    .select("total_xp")
    .eq("user_id", user.id)
    .single();

  const xpByDay: Record<string, number> = {};
  (xpLogsData ?? []).forEach((r: any) => {
    const day = r.created_at.slice(0, 10);
    xpByDay[day] = (xpByDay[day] ?? 0) + r.xp_gained;
  });

  const totalLoggedXp = Object.values(xpByDay).reduce((a, b) => a + b, 0);
  let runningXp = (profileData?.total_xp ?? 0) - totalLoggedXp;
  const xpCurveData = days.map((day) => {
    runningXp += xpByDay[day] ?? 0;
    return { date: day, cumulative_xp: Math.max(0, runningXp) };
  });

  return <AnalyticsClient weeklyXpData={weeklyXp} analytics={analytics} xpCurveData={xpCurveData} />;
}
