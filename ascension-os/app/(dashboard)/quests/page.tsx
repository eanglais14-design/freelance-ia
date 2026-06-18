import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getQuests, getDailyQuests } from "@/lib/actions/quests";
import { QuestsClient } from "./QuestsClient";

export default async function QuestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [daily, weekly, longterm] = await Promise.all([
    getDailyQuests(),
    getQuests("weekly"),
    getQuests("longterm"),
  ]);

  return <QuestsClient daily={daily} weekly={weekly} longterm={longterm} />;
}
