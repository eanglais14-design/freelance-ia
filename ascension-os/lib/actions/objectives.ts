"use server";
import { createClient } from "@/lib/supabase/server";
import { awardXp } from "./profile";
import { revalidatePath } from "next/cache";

export async function getObjectives() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("objectives")
    .select("*, milestones(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function createObjective(data: {
  title: string;
  description?: string;
  domain: string;
  due_date?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("objectives").insert({
    user_id: user.id,
    title: data.title,
    description: data.description || null,
    domain: data.domain,
    status: "active",
    due_date: data.due_date || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/objectives");
  return { success: true };
}

export async function completeMilestone(milestoneId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: milestone } = await supabase
    .from("milestones")
    .select("*, objectives(domain)")
    .eq("id", milestoneId)
    .single();

  if (!milestone) return { error: "Milestone not found" };

  await supabase
    .from("milestones")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", milestoneId);

  if (milestone.xp_reward > 0 && milestone.objectives?.domain) {
    await awardXp(user.id, milestone.xp_reward, milestone.objectives.domain, 0);
  }

  revalidatePath("/objectives");
  return { success: true };
}

export async function addMilestone(objectiveId: string, title: string, xpReward: number = 25) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await supabase.from("milestones").insert({
    objective_id: objectiveId,
    user_id: user.id,
    title,
    status: "pending",
    xp_reward: xpReward,
  });

  revalidatePath("/objectives");
  return { success: true };
}
