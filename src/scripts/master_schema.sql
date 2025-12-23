-- MASTER SCHEMA SETUP for Vision Fitness (Single Gym Architecture)
-- Run this script to completely reset and initialize the database.
-- WARNING: This will drop existing tables and data.

-- 1. Clean Slate
drop table if exists "User" cascade;
drop table if exists "Gym" cascade; -- Legacy cleanup
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

-- Enable UUIDs
create extension if not exists "uuid-ossp";

-- 2. User Table (Public Profile)
create table "User" (
  "id" uuid primary key references auth.users(id) on delete cascade,
  "email" text not null,
  "name" text,
  "role" text check (role in ('ADMIN', 'TRAINER', 'MEMBER')),
  "assignedTrainerId" uuid, 
  "password" text, -- legacy
  "createdAt" timestamp with time zone default now(),
  "updatedAt" timestamp with time zone default now()
);

-- Self-reference for assigned trainer
alter table "User" add constraint fk_trainer foreign key ("assignedTrainerId") references "User"("id");

-- 3. TrainerProfile
create table "TrainerProfile" (
  "id" uuid default uuid_generate_v4() primary key,
  "userId" uuid references "User"("id") not null unique,
  "bio" text,
  "specialties" text, -- simplified to text for now, or text[]
  "rating" numeric default 0,
  "createdAt" timestamp with time zone default now()
);

-- 4. TrainerReview
create table "TrainerReview" (
  "id" uuid default uuid_generate_v4() primary key,
  "memberId" uuid references "User"("id") not null,
  "trainerId" uuid references "User"("id") not null,
  "rating" int check (rating >= 1 and rating <= 5),
  "comment" text,
  "createdAt" timestamp with time zone default now()
);

-- 5. Membership
create table "Membership" (
  "id" uuid default uuid_generate_v4() primary key,
  "userId" uuid references "User"("id") not null,
  "planName" text,
  "status" text default 'active',
  "price" numeric,
  "startDate" date default CURRENT_DATE,
  "endDate" date,
  "updatedAt" timestamp with time zone default now(),
  "createdAt" timestamp with time zone default now()
);

-- 6. Billing
create table "Billing" (
  "id" uuid default uuid_generate_v4() primary key,
  "userId" uuid references "User"("id") not null,
  "status" text default 'PENDING',
  "amount" numeric,
  "method" text,
  "note" text,
  "date" timestamp with time zone default now(),
  "dueDate" date,
  "createdAt" timestamp with time zone default now()
);

-- 7. Attendance
create table "Attendance" (
  "id" uuid default uuid_generate_v4() primary key,
  "userId" uuid references "User"("id") not null,
  "date" text, -- ISO string YYYY-MM-DD
  "checkInTime" timestamp with time zone default now()
);

-- 8. Announcement
create table "Announcement" (
  "id" uuid default uuid_generate_v4() primary key,
  "title" text not null,
  "content" text,
  "createdAt" timestamp with time zone default now()
);

-- 9. Exercise
create table "Exercise" (
  "id" uuid default uuid_generate_v4() primary key,
  "name" text not null,
  "category" text,
  "videoUrl" text,
  "createdAt" timestamp with time zone default now()
);

-- 10. WorkoutTemplate
create table "WorkoutTemplate" (
  "id" uuid default uuid_generate_v4() primary key,
  "name" text not null,
  "description" text,
  "trainerId" uuid references "User"("id"),
  "createdAt" timestamp with time zone default now()
);

-- 11. WorkoutDay
create table "WorkoutDay" (
  "id" uuid default uuid_generate_v4() primary key,
  "templateId" uuid references "WorkoutTemplate"("id") on delete cascade,
  "title" text not null,
  "order" int default 0
);

-- 12. WorkoutDayExercise
create table "WorkoutDayExercise" (
  "id" uuid default uuid_generate_v4() primary key,
  "dayId" uuid references "WorkoutDay"("id") on delete cascade,
  "exerciseId" uuid references "Exercise"("id"),
  "sets" int default 3,
  "reps" int default 10,
  "order" int default 0
);

-- 13. AppSettings (Optional global config)
create table "AppSettings" (
    "id" uuid default uuid_generate_v4() primary key,
    "gymName" text default 'Vision Fitness',
    "adminCode" text default 'VISION-ADMIN', 
    "trainerCode" text default 'VISION-TRAINER',
    "createdAt" timestamp with time zone default now()
);

-- Seed default settings
insert into "AppSettings" ("gymName", "adminCode", "trainerCode") values ('Vision Fitness', 'VISION-ADMIN', 'VISION-TRAINER');

-- RLS Policies (Allow All for Development)
alter table "User" enable row level security;
alter table "TrainerProfile" enable row level security;
alter table "TrainerReview" enable row level security;
alter table "Membership" enable row level security;
alter table "Billing" enable row level security;
alter table "Attendance" enable row level security;
alter table "Announcement" enable row level security;
alter table "Exercise" enable row level security;
alter table "WorkoutTemplate" enable row level security;
alter table "WorkoutDay" enable row level security;
alter table "WorkoutDayExercise" enable row level security;
alter table "AppSettings" enable row level security;

create policy "Allow All" on "User" for all using (true);
create policy "Allow All" on "TrainerProfile" for all using (true);
create policy "Allow All" on "TrainerReview" for all using (true);
create policy "Allow All" on "Membership" for all using (true);
create policy "Allow All" on "Billing" for all using (true);
create policy "Allow All" on "Attendance" for all using (true);
create policy "Allow All" on "Announcement" for all using (true);
create policy "Allow All" on "Exercise" for all using (true);
create policy "Allow All" on "WorkoutTemplate" for all using (true);
create policy "Allow All" on "WorkoutDay" for all using (true);
create policy "Allow All" on "WorkoutDayExercise" for all using (true);
create policy "Allow All" on "AppSettings" for all using (true);
