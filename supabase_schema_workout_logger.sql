-- Create table for Workout Logs (Sessions)
create table if not exists workout_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null default 'Workout', -- e.g. "Push Day", "Legs"
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ended_at timestamp with time zone, -- Null implies active
  duration_seconds integer default 0,
  volume_kg integer default 0
);

-- Create table for Workout Sets
create table if not exists workout_sets (
  id uuid default gen_random_uuid() primary key,
  workout_log_id uuid references workout_logs(id) on delete cascade not null,
  exercise_name text not null,
  set_number integer not null,
  weight_kg numeric,
  reps integer,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table workout_logs enable row level security;
alter table workout_sets enable row level security;

-- Workout Logs Policies
create policy "Users can view their own workout logs"
  on workout_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own workout logs"
  on workout_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own workout logs"
  on workout_logs for update
  using (auth.uid() = user_id);

-- Workout Sets Policies
create policy "Users can view their own workout sets"
  on workout_sets for select
  using (
    exists (
      select 1 from workout_logs
      where workout_logs.id = workout_sets.workout_log_id
      and workout_logs.user_id = auth.uid()
    )
  );

create policy "Users can insert their own workout sets"
  on workout_sets for insert
  with check (
    exists (
      select 1 from workout_logs
      where workout_logs.id = workout_sets.workout_log_id
      and workout_logs.user_id = auth.uid()
    )
  );
