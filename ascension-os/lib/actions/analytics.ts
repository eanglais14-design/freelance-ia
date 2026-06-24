"use server";
import { createClient } from "@/lib/supabase/server";

export async function getWeeklyXpData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result = days.map((day) => ({ day, xp: 0 }));

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("quest_completions")
    .select("xp_earned, completed_at")
    .eq("user_id", user.id)
    .gte("completed_at", weekStart.toISOString());

  (data || []).forEach((completion) => {
    const day = new Date(completion.completed_at).getDay();
    result[day].xp += completion.xp_earned;
  });

  // Add focus session XP too
  const { data: focusSessions } = await supabase
    .from("focus_sessions")
    .select("xp_earned, completed_at")
    .eq("user_id", user.id)
    .gte("completed_at", weekStart.toISOString());

  (focusSessions || []).forEach((session) => {
    const day = new Date(session.completed_at).getDay();
    result[day].xp += session.xp_earned;
  });

  return result;
}

export async function getAnalyticsData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [completions, skills, focusSessions] = await Promise.all([
    supabase.from("quest_completions").select("*").eq("user_id", user.id).gte("completed_at", thirtyDaysAgo.toISOString()),
    supabase.from("skills").select("*").eq("user_id", user.id),
    supabase.from("focus_sessions").select("*").eq("user_id", user.id).eq("status", "completed").gte("completed_at", thirtyDaysAgo.toISOString()),
  ]);

  return {
    completions: completions.data || [],
    skills: skills.data || [],
    focusSessions: focusSessions.data || [],
  };
}
