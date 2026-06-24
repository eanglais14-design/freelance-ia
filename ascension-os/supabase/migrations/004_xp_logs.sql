create table if not exists public.xp_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  xp_gained integer not null,
  source text not null default 'quest',
  created_at timestamptz default now() not null
);
alter table public.xp_logs enable row level security;
create policy "Users can read own xp_logs" on public.xp_logs for select using (auth.uid() = user_id);
create policy "Users can insert own xp_logs" on public.xp_logs for insert with check (auth.uid() = user_id);
