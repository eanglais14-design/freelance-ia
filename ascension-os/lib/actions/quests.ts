"use server";
import { createClient } from "@/lib/supabase/server";
import { awardXp, updateStreak } from "./profile";
import { revalidatePath } from "next/cache";
import { Quest } from "@/types";

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

  // Reset daily quests if needed
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
    const completedDate = new Date(q.completed_at).toISOString().split("T")[0];
    return completedDate < today;
  });

  if (needsReset) {
    await supabase
      .from("quests")
      .update({ status: "pending", completed_at: null })
      .eq("user_id", userId)
      .eq("quest_type", "daily");
  }
}

export async function completeQuest(questId: string) {
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
  await supabase
    .from("quests")
    .update({ status: "completed", completed_at: now })
    .eq("id", questId);

  await supabase.from("quest_completions").insert({
    user_id: user.id,
    quest_id: questId,
    xp_earned: quest.xp_reward,
    coins_earned: quest.coin_reward,
    completed_at: now,
  });

  await awardXp(user.id, quest.xp_reward, quest.domain, quest.coin_reward);
  await updateStreak(user.id);

  // Check if all daily quests are done for bonus XP
  if (quest.quest_type === "daily") {
    const { data: allDaily } = await supabase
      .from("quests")
      .select("status")
      .eq("user_id", user.id)
      .eq("quest_type", "daily");

    const allCompleted = allDaily?.every((q) => q.status === "completed");
    if (allCompleted) {
      await awardXp(user.id, 100, quest.domain, 0);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/quests");
  return { success: true, xp: quest.xp_reward };
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
