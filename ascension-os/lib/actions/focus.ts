"use server";
import { createClient } from "@/lib/supabase/server";
import { awardXp } from "./profile";
import { revalidatePath } from "next/cache";
import { Domain } from "@/types";

export async function completeFocusSession(domain: Domain, durationMinutes: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const xpEarned = Math.floor(durationMinutes / 5);
  const now = new Date().toISOString();

  await supabase.from("focus_sessions").insert({
    user_id: user.id,
    domain,
    duration_minutes: durationMinutes,
    xp_earned: xpEarned,
    started_at: new Date(Date.now() - durationMinutes * 60 * 1000).toISOString(),
    completed_at: now,
    status: "completed",
  });

  await awardXp(user.id, xpEarned, domain, 0);
  revalidatePath("/focus");
  revalidatePath("/dashboard");
  return { success: true, xp: xpEarned };
}

export async function getFocusSessions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("focus_sessions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(50);

  return data || [];
}
