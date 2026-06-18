-- Ascension OS Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- =====================
-- PROFILES
-- =====================
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  username text not null,
  total_xp integer not null default 0,
  level integer not null default 1,
  rank text not null default 'E' check (rank in ('E', 'D', 'C', 'B', 'A', 'S')),
  streak integer not null default 0,
  last_active_date date,
  coins integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================
-- QUESTS
-- =====================
create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  domain text not null check (domain in ('fitness', 'ai_automation', 'business_sales', 'mba_studies', 'music_production', 'mind_discipline', 'social_networking')),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard', 'boss')),
  xp_reward integer not null default 25,
  coin_reward integer not null default 3,
  status text not null default 'pending' check (status in ('pending', 'completed', 'skipped')),
  quest_type text not null check (quest_type in ('daily', 'weekly', 'longterm')),
  due_date date,
  repeat_type text not null default 'none' check (repeat_type in ('none', 'daily', 'weekly')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- =====================
-- QUEST COMPLETIONS
-- =====================
create table if not exists public.quest_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quest_id uuid not null references public.quests(id) on delete cascade,
  xp_earned integer not null default 0,
  coins_earned integer not null default 0,
  completed_at timestamptz not null default now()
);

-- =====================
-- SKILLS
-- =====================
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  domain text not null check (domain in ('fitness', 'ai_automation', 'business_sales', 'mba_studies', 'music_production', 'mind_discipline', 'social_networking')),
  xp integer not null default 0,
  level integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, domain)
);

-- =====================
-- OBJECTIVES
-- =====================
create table if not exists public.objectives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  domain text not null check (domain in ('fitness', 'ai_automation', 'business_sales', 'mba_studies', 'music_production', 'mind_discipline', 'social_networking')),
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  due_date date,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- =====================
-- MILESTONES
-- =====================
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  objective_id uuid not null references public.objectives(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  xp_reward integer not null default 25,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- =====================
-- FOCUS SESSIONS
-- =====================
create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  domain text not null check (domain in ('fitness', 'ai_automation', 'business_sales', 'mba_studies', 'music_production', 'mind_discipline', 'social_networking')),
  duration_minutes integer not null,
  xp_earned integer not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled'))
);

-- =====================
-- ROW LEVEL SECURITY
-- =====================
alter table public.profiles enable row level security;
alter table public.quests enable row level security;
alter table public.quest_completions enable row level security;
alter table public.skills enable row level security;
alter table public.objectives enable row level security;
alter table public.milestones enable row level security;
alter table public.focus_sessions enable row level security;

-- Profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = user_id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = user_id);

-- Quests
create policy "Users can manage own quests" on public.quests for all using (auth.uid() = user_id);

-- Quest completions
create policy "Users can manage own completions" on public.quest_completions for all using (auth.uid() = user_id);

-- Skills
create policy "Users can manage own skills" on public.skills for all using (auth.uid() = user_id);

-- Objectives
create policy "Users can manage own objectives" on public.objectives for all using (auth.uid() = user_id);

-- Milestones
create policy "Users can manage own milestones" on public.milestones for all using (auth.uid() = user_id);

-- Focus sessions
create policy "Users can manage own focus sessions" on public.focus_sessions for all using (auth.uid() = user_id);

-- =====================
-- INDEXES
-- =====================
create index if not exists idx_quests_user_id on public.quests(user_id);
create index if not exists idx_quests_user_type on public.quests(user_id, quest_type);
create index if not exists idx_quest_completions_user_id on public.quest_completions(user_id);
create index if not exists idx_quest_completions_completed_at on public.quest_completions(completed_at);
create index if not exists idx_skills_user_id on public.skills(user_id);
create index if not exists idx_objectives_user_id on public.objectives(user_id);
create index if not exists idx_milestones_objective_id on public.milestones(objective_id);
create index if not exists idx_focus_sessions_user_id on public.focus_sessions(user_id);
