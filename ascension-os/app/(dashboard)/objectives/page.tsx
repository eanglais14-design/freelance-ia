import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getObjectives } from "@/lib/actions/objectives";
import { ObjectivesClient } from "./ObjectivesClient";

export default async function ObjectivesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const objectives = await getObjectives();
  return <ObjectivesClient objectives={objectives as any} />;
}
