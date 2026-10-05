-- Pomo schema v1. Chạy file này trong Supabase SQL Editor (hoặc supabase db push).
-- Mọi bảng bật RLS, scoped theo auth.uid(). Không có delete policy cho focus_sessions.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  daily_goal_minutes int not null default 120
    check (daily_goal_minutes between 15 and 960),
  preferred_session_minutes int not null default 25
    check (preferred_session_minutes between 5 and 120),
  locale text not null default 'vi' check (locale in ('vi','en')),
  sound_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  priority text not null default 'medium' check (priority in ('high','medium','low')),
  deadline date,
  completed_at timestamptz,
  position double precision not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tasks_user_position_idx on public.tasks (user_id, position);
create index tasks_user_deadline_idx on public.tasks (user_id, deadline)
  where completed_at is null;

create table public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  task_title text not null,
  planned_minutes int not null check (planned_minutes between 1 and 240),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  actual_focus_seconds int check (actual_focus_seconds >= 0),
  distraction_seconds int not null default 0 check (distraction_seconds >= 0),
  ended_reason text not null default 'in_progress'
    check (ended_reason in ('in_progress','completed','stopped_early')),
  created_at timestamptz not null default now()
);
create index sessions_user_started_idx on public.focus_sessions (user_id, started_at desc);
create index sessions_inprogress_idx on public.focus_sessions (user_id)
  where ended_reason = 'in_progress';

create or replace function public.set_updated_at() returns trigger
language plpgsql as $fn$
begin
  new.updated_at = now();
  return new;
end $fn$;
create trigger tasks_set_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $fn$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end $fn$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.focus_sessions enable row level security;

create policy profiles_select on public.profiles for select using (auth.uid() = id);
create policy profiles_insert on public.profiles for insert with check (auth.uid() = id);
create policy profiles_update on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

create policy tasks_select on public.tasks for select using (auth.uid() = user_id);
create policy tasks_insert on public.tasks for insert with check (auth.uid() = user_id);
create policy tasks_update on public.tasks for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy tasks_delete on public.tasks for delete using (auth.uid() = user_id);

create policy sessions_select on public.focus_sessions for select using (auth.uid() = user_id);
create policy sessions_insert on public.focus_sessions for insert with check (auth.uid() = user_id);
create policy sessions_update on public.focus_sessions for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
