import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SkillCard } from "@/components/game/SkillCard";
import { Skill } from "@/types";
import { calculateLevel } from "@/lib/utils";

export default async function SkillsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .eq("user_id", user.id)
    .order("xp", { ascending: false });

  const totalSkillXp = (skills || []).reduce((s: number, sk: any) => s + sk.xp, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Skills</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Your domain mastery levels</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(skills || []).map((skill: any) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>

      {totalSkillXp === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">Complete quests to grow your domain skills.</p>
        </div>
      )}
    </div>
  );
}
