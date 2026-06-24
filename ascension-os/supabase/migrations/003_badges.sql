create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_key text not null,
  unlocked_at timestamptz default now() not null,
  unique(user_id, badge_key)
);
alter table public.badges enable row level security;
create policy "Users can read own badges" on public.badges for select using (auth.uid() = user_id);
create policy "Users can insert own badges" on public.badges for insert with check (auth.uid() = user_id);
