-- Add unique constraint to prevent multiple check-ins per day
-- We can create a unique index on user_id and the DATE cast of check_in_time
create unique index if not exists unique_daily_checkin on public.attendance (user_id, (check_in_time::date));

-- Trainer Access Policy for Attendance
-- Trainers can view attendance of their assigned clients
create policy "Trainers view assigned clients attendance" on public.attendance
  for select using (
    exists (
      select 1 from public.trainer_assignments 
      where trainer_id = auth.uid() 
      and client_id = public.attendance.user_id
    )
  );
