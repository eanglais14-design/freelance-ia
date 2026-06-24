export type Rank = "E" | "D" | "C" | "B" | "A" | "S";
export type Difficulty = "easy" | "medium" | "hard" | "boss";
export type QuestStatus = "pending" | "completed" | "skipped";
export type QuestType = "daily" | "weekly" | "longterm";
export type Domain =
  | "fitness"
  | "ai_automation"
  | "business_sales"
  | "mba_studies"
  | "music_production"
  | "mind_discipline"
  | "social_networking";

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  total_xp: number;
  level: number;
  rank: Rank;
  streak: number;
  last_active_date: string | null;
  coins: number;
  created_at: string;
  updated_at: string;
}

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  domain: Domain;
  difficulty: Difficulty;
  xp_reward: number;
  coin_reward: number;
  status: QuestStatus;
  quest_type: QuestType;
  due_date: string | null;
  repeat_type: "none" | "daily" | "weekly";
  created_at: string;
  completed_at: string | null;
}

export interface QuestCompletion {
  id: string;
  user_id: string;
  quest_id: string;
  completed_at: string;
  xp_earned: number;
  coins_earned: number;
}

export interface Skill {
  id: string;
  user_id: string;
  domain: Domain;
  xp: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface Objective {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  domain: Domain;
  status: "active" | "completed" | "paused";
  due_date: string | null;
  created_at: string;
  completed_at: string | null;
  milestones?: Milestone[];
}

export interface Milestone {
  id: string;
  objective_id: string;
  user_id: string;
  title: string;
  status: "pending" | "completed";
  xp_reward: number;
  created_at: string;
  completed_at: string | null;
}

export interface FocusSession {
  id: string;
  user_id: string;
  domain: Domain;
  duration_minutes: number;
  xp_earned: number;
  started_at: string;
  completed_at: string | null;
  status: "active" | "completed" | "cancelled";
}

export interface DashboardStats {
  profile: Profile;
  todayQuests: Quest[];
  completedToday: number;
  weeklyXp: number;
  activeObjectives: Objective[];
  skills: Skill[];
}
