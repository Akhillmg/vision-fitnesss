-- Refactor: Remove Gym Table and all references

-- 1. Drop constraints and columns referencing Gym
alter table "User" drop column if exists "gymId";
alter table "TrainerProfile" drop column if exists "gymId";
alter table "Attendance" drop column if exists "gymId";

-- 2. Drop the Gym table
drop table if exists "Gym" cascade;

-- 3. Ensure tables are clean (optional steps if needed)
-- (No specific clean up needed if foreign keys are dropped with cascade or columns removed)

-- 4. Re-verify Users table structure just in case
-- User should only have id, email, name, role, assignedTrainerId...
-- GymId is gone.

-- 5. Add AppSettings table for global config if needed (optional single row)
create table if not exists "AppSettings" (
    "id" uuid default uuid_generate_v4() primary key,
    "gymName" text default 'Vision Fitness',
    -- Add single global codes here if we want them in DB instead of hardcoded
    "adminCode" text default 'VISION-ADMIN', 
    "trainerCode" text default 'VISION-TRAINER',
    "createdAt" timestamp with time zone default now()
);

-- Insert default settings row if empty
insert into "AppSettings" ("gymName", "adminCode", "trainerCode")
select 'Vision Fitness', 'VISION-ADMIN', 'VISION-TRAINER'
where not exists (select 1 from "AppSettings");

-- Enable RLS for AppSettings
alter table "AppSettings" enable row level security;
create policy "Allow Read All" on "AppSettings" for select using (true);
create policy "Allow Admin Update" on "AppSettings" for update using (
    exists (select 1 from "User" where id = auth.uid() and role = 'ADMIN')
);
