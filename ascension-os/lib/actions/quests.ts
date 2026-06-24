"use server";
import { createClient } from "@/lib/supabase/server";
import { awardXp, updateStreak } from "./profile";
import { revalidatePath } from "next/cache";
import { Quest } from "@/types";
import { checkBadges, BadgeKey } from "@/lib/badges";
import { calculateLevel } from "@/lib/utils";

export async function getQuests(type?: "daily" | "weekly" | "longterm") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("quests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (type) query = query.eq("quest_type", type);

  const { data } = await query;
  return (data || []) as Quest[];
}

export async function getDailyQuests() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  await resetDailyQuestsIfNeeded(user.id);

  const { data } = await supabase
    .from("quests")
    .select("*")
    .eq("user_id", user.id)
    .eq("quest_type", "daily")
    .order("created_at");

  return (data || []) as Quest[];
}

async function resetDailyQuestsIfNeeded(userId: string) {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: completedToday } = await supabase
    .from("quests")
    .select("id, completed_at")
    .eq("user_id", userId)
    .eq("quest_type", "daily")
    .eq("status", "completed");

  if (!completedToday?.length) return;

  const needsReset = completedToday.some((q) => {
    if (!q.completed_at) return false;
    return new Date(q.completed_at).toISOString().split("T")[0] < today;
  });

  if (needsReset) {
    await supabase
      .from("quests")
      .update({ status: "pending", completed_at: null })
      .eq("user_id", userId)
      .eq("quest_type", "daily");
  }
}

export async function completeQuest(questId: string): Promise<{ success?: boolean; xp?: number; newBadges?: string[]; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: quest } = await supabase
    .from("quests")
    .select("*")
    .eq("id", questId)
    .eq("user_id", user.id)
    .single();

  if (!quest || quest.status === "completed") return { error: "Quest not found or already completed" };

  const now = new Date().toISOString();

  await supabase.from("quests").update({ status: "completed", completed_at: now }).eq("id", questId);
  await supabase.from("quest_completions").insert({
    user_id: user.id,
    quest_id: questId,
    xp_earned: quest.xp_reward,
    coins_earned: quest.coin_reward,
    completed_at: now,
  });

  // Get updated profile for streak bonus
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
  const streak = profile?.streak ?? 0;
  let streakBonus = 0;
  if (streak >= 30) streakBonus = 100;
  else if (streak >= 7) streakBonus = 50;
  else if (streak >= 3) streakBonus = 25;

  const totalXp = quest.xp_reward + streakBonus;

  await awardXp(user.id, totalXp, quest.domain, quest.coin_reward);
  await updateStreak(user.id);

  // Log XP
  await supabase.from("xp_logs").insert({ user_id: user.id, xp_gained: totalXp, source: "quest" });

  // All-daily bonus
  if (quest.quest_type === "daily") {
    const { data: allDaily } = await supabase
      .from("quests")
      .select("status")
      .eq("user_id", user.id)
      .eq("quest_type", "daily");

    if (allDaily?.every((q) => q.status === "completed")) {
      await awardXp(user.id, 100, quest.domain, 0);
      await supabase.from("xp_logs").insert({ user_id: user.id, xp_gained: 100, source: "daily_bonus" });
    }
  }

  // Badge checking
  const { data: existingBadges } = await supabase.from("badges").select("badge_key").eq("user_id", user.id);
  const { data: completionsCount } = await supabase
    .from("quest_completions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: updatedProfile } = await supabase.from("profiles").select("total_xp, streak").eq("user_id", user.id).single();
  const level = calculateLevel(updatedProfile?.total_xp ?? 0);

  const newBadgeKeys = checkBadges({
    totalQuestsCompleted: (completionsCount as any)?.count ?? 0,
    streak: updatedProfile?.streak ?? streak,
    level,
    existingBadges: (existingBadges ?? []).map((b: any) => b.badge_key),
  });

  if (newBadgeKeys.length > 0) {
    await supabase.from("badges").insert(
      newBadgeKeys.map((key) => ({ user_id: user.id, badge_key: key }))
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/quests");
  return { success: true, xp: totalXp, newBadges: newBadgeKeys };
}

export async function createQuest(data: {
  title: string;
  description?: string;
  domain: string;
  difficulty: string;
  quest_type: string;
  due_date?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const xpMap: Record<string, number> = { easy: 25, medium: 50, hard: 100, boss: 250 };
  const coinMap: Record<string, number> = { easy: 3, medium: 5, hard: 10, boss: 25 };
  const xp_reward = xpMap[data.difficulty] || 25;
  const coin_reward = coinMap[data.difficulty] || 3;
  const repeat_type = data.quest_type === "daily" ? "daily" : data.quest_type === "weekly" ? "weekly" : "none";

  const { error } = await supabase.from("quests").insert({
    user_id: user.id,
    title: data.title,
    description: data.description || null,
    domain: data.domain,
    difficulty: data.difficulty,
    quest_type: data.quest_type,
    xp_reward,
    coin_reward,
    status: "pending",
    repeat_type,
    due_date: data.due_date || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/quests");
  return { success: true };
}

export async function deleteQuest(questId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await supabase.from("quests").delete().eq("id", questId).eq("user_id", user.id);
  revalidatePath("/quests");
  return { success: true };
}
