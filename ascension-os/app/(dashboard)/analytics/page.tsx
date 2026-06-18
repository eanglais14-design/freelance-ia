import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getWeeklyXpData, getAnalyticsData } from "@/lib/actions/analytics";
import { AnalyticsClient } from "./AnalyticsClient";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [weeklyXp, analytics] = await Promise.all([getWeeklyXpData(), getAnalyticsData()]);

  return <AnalyticsClient weeklyXpData={weeklyXp} analytics={analytics} />;
}
