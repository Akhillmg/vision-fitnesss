-- Add targeting to announcements
alter table public.announcements 
add column if not exists audience_role text default 'ALL' check (audience_role in ('ALL', 'MEMBER', 'TRAINER'));

-- Update RLS for reading (Members/Trainers only see their announcements)
drop policy if exists "Everyone reads active announcements" on public.announcements;

create policy "Users read relevant announcements" on public.announcements 
  for select using (
    active = true 
    and (
      audience_role = 'ALL' 
      or 
      audience_role = (select role from public.users where id = auth.uid())
    )
  );
