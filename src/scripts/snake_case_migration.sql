-- SNAKE_CASE MIGRATION
-- Aligns database with standard Supabase conventions and "Fix 862" request.

-- 1. Drop PascalCase tables
drop table if exists "User" cascade;
drop table if exists "Gym" cascade;
drop table if exists "TrainerProfile" cascade;
drop table if exists "TrainerReview" cascade;
drop table if exists "Membership" cascade;
drop table if exists "Billing" cascade;
drop table if exists "Attendance" cascade;
drop table if exists "Announcement" cascade;
drop table if exists "Exercise" cascade;
drop table if exists "WorkoutTemplate" cascade;
drop table if exists "WorkoutDay" cascade;
drop table if exists "WorkoutDayExercise" cascade;
drop table if exists "AppSettings" cascade;

-- 2. Create snake_case tables
create table public.gym_config (
  id uuid default gen_random_uuid() primary key,
  gym_name text default 'Vision Fitness',
  admin_code text default 'admin123',
  trainer_code text default 'trainer123',
  created_at timestamp with time zone default now()
);

insert into public.gym_config (gym_name, admin_code, trainer_code) values ('Vision Fitness', 'VISION-ADMIN', 'VISION-TRAINER');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text, -- was name
  role text check (role in ('ADMIN', 'TRAINER', 'MEMBER')),
  assigned_trainer_id uuid references public.users(id), -- was assignedTrainerId
  password text, 
  status text default 'active',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table public.trainer_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null unique,
  bio text,
  specialties text,
  rating numeric default 0,
  created_at timestamp with time zone default now()
);

create table public.trainer_reviews (
  id uuid default gen_random_uuid() primary key,
  member_id uuid references public.users(id) not null,
  trainer_id uuid references public.users(id) not null,
  rating int check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now()
);

create table public.memberships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  plan_name text,
  status text default 'active',
  price numeric,
  start_date date default CURRENT_DATE,
  end_date date,
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

create table public.billing (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  status text default 'PENDING',
  amount numeric,
  method text,
  note text,
  date timestamp with time zone default now(),
  due_date date,
  created_at timestamp with time zone default now()
);

create table public.attendance (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  date text, 
  check_in_time timestamp with time zone default now()
);

create table public.announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text,
  created_at timestamp with time zone default now()
);

create table public.exercises (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text,
  video_url text,
  created_at timestamp with time zone default now()
);

create table public.workout_templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  trainer_id uuid references public.users(id),
  created_at timestamp with time zone default now()
);

create table public.workout_days (
  id uuid default gen_random_uuid() primary key,
  template_id uuid references public.workout_templates(id) on delete cascade,
  title text not null,
  "order" int default 0
);

create table public.workout_day_exercises (
  id uuid default gen_random_uuid() primary key,
  day_id uuid references public.workout_days(id) on delete cascade,
  exercise_id uuid references public.exercises(id),
  sets int default 3,
  reps int default 10,
  "order" int default 0
);

-- RLS
alter table public.gym_config enable row level security;
alter table public.users enable row level security;
alter table public.trainer_profiles enable row level security;
alter table public.trainer_reviews enable row level security;
alter table public.memberships enable row level security;
alter table public.billing enable row level security;
alter table public.attendance enable row level security;
alter table public.announcements enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_templates enable row level security;
alter table public.workout_days enable row level security;
alter table public.workout_day_exercises enable row level security;

create policy "Allow All" on public.gym_config for all using (true);
create policy "Allow All" on public.users for all using (true);
create policy "Allow All" on public.trainer_profiles for all using (true);
create policy "Allow All" on public.trainer_reviews for all using (true);
create policy "Allow All" on public.memberships for all using (true);
create policy "Allow All" on public.billing for all using (true);
create policy "Allow All" on public.attendance for all using (true);
create policy "Allow All" on public.announcements for all using (true);
create policy "Allow All" on public.exercises for all using (true);
create policy "Allow All" on public.workout_templates for all using (true);
create policy "Allow All" on public.workout_days for all using (true);
create policy "Allow All" on public.workout_day_exercises for all using (true);
