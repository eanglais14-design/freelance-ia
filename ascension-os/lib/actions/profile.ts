"use server";
import { createClient } from "@/lib/supabase/server";
import { calculateLevel, getRank, getXpForDifficulty } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { Domain } from "@/types";

export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data;
}

export async function ensureProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (existing) return existing;

  const username = user.user_metadata?.username || user.email?.split("@")[0] || "Hunter";
  const { data: newProfile } = await supabase
    .from("profiles")
    .insert({ user_id: user.id, username, total_xp: 0, level: 1, rank: "E", streak: 0, coins: 0 })
    .select()
    .single();

  // Create default skills
  const domains: Domain[] = ["fitness", "ai_automation", "business_sales", "mba_studies", "music_production", "mind_discipline", "social_networking"];
  await supabase.from("skills").insert(
    domains.map((domain) => ({ user_id: user.id, domain, xp: 0, level: 1 }))
  );

  // Create default daily quests
  const defaultQuests = [
    { title: "90 min deep work session", domain: "mind_discipline", difficulty: "hard", xp_reward: 100, coin_reward: 10, quest_type: "daily", repeat_type: "daily" },
    { title: "Gym session", domain: "fitness", difficulty: "medium", xp_reward: 50, coin_reward: 5, quest_type: "daily", repeat_type: "daily" },
    { title: "Work on AI automation project", domain: "ai_automation", difficulty: "medium", xp_reward: 50, coin_reward: 5, quest_type: "daily", repeat_type: "daily" },
    { title: "Apply to 1 job/internship", domain: "business_sales", difficulty: "easy", xp_reward: 25, coin_reward: 3, quest_type: "daily", repeat_type: "daily" },
    { title: "30 min music production", domain: "music_production", difficulty: "easy", xp_reward: 25, coin_reward: 3, quest_type: "daily", repeat_type: "daily" },
    { title: "Read or study 30 min", domain: "mba_studies", difficulty: "easy", xp_reward: 25, coin_reward: 3, quest_type: "daily", repeat_type: "daily" },
  ];

  await supabase.from("quests").insert(
    defaultQuests.map((q) => ({ ...q, user_id: user.id, status: "pending", description: null, due_date: null }))
  );

  return newProfile;
}

export async function awardXp(userId: string, xp: number, domain: Domain, coins: number = 0) {
  const supabase = await createClient();

  // Update global XP
  const { data: profile } = await supabase
    .from("profiles")
    .select("total_xp, coins")
    .eq("user_id", userId)
    .single();

  if (!profile) return;

  const newXp = profile.total_xp + xp;
  const newLevel = calculateLevel(newXp);
  const newRank = getRank(newLevel);

  await supabase
    .from("profiles")
    .update({ total_xp: newXp, level: newLevel, rank: newRank, coins: (profile.coins || 0) + coins, updated_at: new Date().toISOString() })
    .eq("user_id", userId);

  // Update domain skill XP
  const { data: skill } = await supabase
    .from("skills")
    .select("xp")
    .eq("user_id", userId)
    .eq("domain", domain)
    .single();

  if (skill) {
    const newSkillXp = skill.xp + xp;
    const newSkillLevel = calculateLevel(newSkillXp);
    await supabase
      .from("skills")
      .update({ xp: newSkillXp, level: newSkillLevel, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("domain", domain);
  }
}

export async function updateStreak(userId: string) {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: profile } = await supabase
    .from("profiles")
    .select("streak, last_active_date")
    .eq("user_id", userId)
    .single();

  if (!profile) return;

  const lastActive = profile.last_active_date;
  if (lastActive === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak = 1;
  if (lastActive === yesterdayStr) {
    newStreak = (profile.streak || 0) + 1;
  }

  await supabase
    .from("profiles")
    .update({ streak: newStreak, last_active_date: today })
    .eq("user_id", userId);
}
