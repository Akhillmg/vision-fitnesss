-- Enable UUIDs
create extension if not exists "uuid-ossp";

-- 1. Gym
create table if not exists "Gym" (
  "id" uuid default uuid_generate_v4() primary key,
  "name" text not null,
  "code" text unique not null,
  "adminCode" text not null,
  "trainerCode" text not null,
  "address" text,
  "updatedAt" timestamp with time zone default now()
);

-- 2. User (Linked to auth.users)
create table if not exists "User" (
  "id" uuid primary key references auth.users(id) on delete cascade,
  "email" text not null,
  "name" text,
  "role" text check (role in ('ADMIN', 'TRAINER', 'MEMBER')),
  "gymId" uuid references "Gym"("id"),
  "assignedTrainerId" uuid, -- Self-reference added later or can be separate
  "password" text, -- legacy
  "createdAt" timestamp with time zone default now(),
  "updatedAt" timestamp with time zone default now()
);

-- Self-reference for assigned trainer
alter table "User" add constraint fk_trainer foreign key ("assignedTrainerId") references "User"("id");

-- 3. TrainerProfile
create table if not exists "TrainerProfile" (
  "id" uuid default uuid_generate_v4() primary key,
  "userId" uuid references "User"("id") not null unique,
  "bio" text,
  "specialties" text[],
  "rating" numeric default 0,
  "createdAt" timestamp with time zone default now()
);

-- 4. TrainerReview
create table if not exists "TrainerReview" (
  "id" uuid default uuid_generate_v4() primary key,
  "memberId" uuid references "User"("id") not null,
  "trainerId" uuid references "User"("id") not null,
  "rating" int check (rating >= 1 and rating <= 5),
  "comment" text,
  "createdAt" timestamp with time zone default now()
);

-- 5. Membership
create table if not exists "Membership" (
  "id" uuid default uuid_generate_v4() primary key,
  "userId" uuid references "User"("id") not null,
  "planName" text,
  "status" text default 'active',
  "endDate" date,
  "createdAt" timestamp with time zone default now()
);

-- 6. Billing
create table if not exists "Billing" (
  "id" uuid default uuid_generate_v4() primary key,
  "userId" uuid references "User"("id") not null,
  "status" text default 'PENDING',
  "amount" numeric,
  "dueDate" date,
  "createdAt" timestamp with time zone default now()
);

-- 7. Attendance
create table if not exists "Attendance" (
  "id" uuid default uuid_generate_v4() primary key,
  "userId" uuid references "User"("id") not null,
  "gymId" uuid references "Gym"("id"),
  "date" date default CURRENT_DATE,
  "checkInTime" timestamp with time zone default now()
);

-- 8. Announcement
create table if not exists "Announcement" (
  "id" uuid default uuid_generate_v4() primary key,
  "title" text not null,
  "content" text,
  "createdAt" timestamp with time zone default now()
);

-- 9. Exercise
create table if not exists "Exercise" (
  "id" uuid default uuid_generate_v4() primary key,
  "name" text not null,
  "category" text,
  "videoUrl" text,
  "createdAt" timestamp with time zone default now()
);

-- 10. WorkoutTemplate
create table if not exists "WorkoutTemplate" (
  "id" uuid default uuid_generate_v4() primary key,
  "name" text not null,
  "description" text,
  "trainerId" uuid references "User"("id"),
  "createdAt" timestamp with time zone default now()
);

-- 11. WorkoutDay
create table if not exists "WorkoutDay" (
  "id" uuid default uuid_generate_v4() primary key,
  "templateId" uuid references "WorkoutTemplate"("id") on delete cascade,
  "title" text not null,
  "order" int default 0
);

-- 12. WorkoutDayExercise
create table if not exists "WorkoutDayExercise" (
  "id" uuid default uuid_generate_v4() primary key,
  "dayId" uuid references "WorkoutDay"("id") on delete cascade,
  "exerciseId" uuid references "Exercise"("id"),
  "sets" int default 3,
  "reps" int default 10,
  "order" int default 0
);

-- RLS Policies (Basic Open for MVP or use Auth)
alter table "Gym" enable row level security;
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

-- Simple Policies (Adjust as needed for strictness)
create policy "Allow All" on "Gym" for all using (true);
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
