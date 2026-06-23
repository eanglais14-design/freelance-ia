export type BadgeKey =
  | "first_blood"
  | "on_fire"
  | "unstoppable"
  | "veteran"
  | "dedicated"
  | "century"
  | "elite"
  | "ascended";

export const BADGE_DEFS: Record<BadgeKey, { label: string; description: string; icon: string }> = {
  first_blood: { label: "First Blood",  description: "Complete your first quest",        icon: "⚡" },
  on_fire:     { label: "On Fire",      description: "3-day streak",                     icon: "🔥" },
  unstoppable: { label: "Unstoppable",  description: "7-day streak",                     icon: "💀" },
  veteran:     { label: "Veteran",      description: "30-day streak",                    icon: "🏆" },
  dedicated:   { label: "Dedicated",    description: "Complete 30 quests",               icon: "🎯" },
  century:     { label: "Century",      description: "Complete 100 quests",              icon: "💯" },
  elite:       { label: "Elite",        description: "Reach rank A (level 30+)",         icon: "⭐" },
  ascended:    { label: "Ascended",     description: "Reach rank S (level 50+)",         icon: "👑" },
};

export function checkBadges(params: {
  totalQuestsCompleted: number;
  streak: number;
  level: number;
  existingBadges: string[];
}): BadgeKey[] {
  const { totalQuestsCompleted, streak, level, existingBadges } = params;
  const newBadges: BadgeKey[] = [];
  const has = (k: BadgeKey) => existingBadges.includes(k);

  if (!has("first_blood") && totalQuestsCompleted >= 1)   newBadges.push("first_blood");
  if (!has("on_fire")     && streak >= 3)                 newBadges.push("on_fire");
  if (!has("unstoppable") && streak >= 7)                 newBadges.push("unstoppable");
  if (!has("veteran")     && streak >= 30)                newBadges.push("veteran");
  if (!has("dedicated")   && totalQuestsCompleted >= 30)  newBadges.push("dedicated");
  if (!has("century")     && totalQuestsCompleted >= 100) newBadges.push("century");
  if (!has("elite")       && level >= 30)                 newBadges.push("elite");
  if (!has("ascended")    && level >= 50)                 newBadges.push("ascended");

  return newBadges;
}
