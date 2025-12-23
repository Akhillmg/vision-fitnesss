-- Fix for "functions in index expression must be marked IMMUTABLE"
-- We cannot use (check_in_time::date) in an index directly.
-- Solution: Add a dedicated date column.

-- 1. Add date column
alter table public.attendance add column if not exists check_in_date date default CURRENT_DATE;

-- 2. Backfill existing records (if any)
update public.attendance set check_in_date = check_in_time::date where check_in_date is null;

-- 3. Create the unique index on the new column
-- First drop the old one if it exists (it likely failed to create)
drop index if exists unique_daily_checkin;
create unique index unique_daily_checkin on public.attendance (user_id, check_in_date);

-- 4. Trainer Access Policy (Re-run in case it didn't execute)
drop policy if exists "Trainers view assigned clients attendance" on public.attendance;
create policy "Trainers view assigned clients attendance" on public.attendance
  for select using (
    exists (
      select 1 from public.trainer_assignments 
      where trainer_id = auth.uid() 
      and client_id = public.attendance.user_id
    )
  );
