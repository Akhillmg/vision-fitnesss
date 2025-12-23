-- Announcements
create table public.announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  created_by uuid references public.users(id),
  created_at timestamp with time zone default now(),
  active boolean default true
);

-- RLS
alter table public.announcements enable row level security;
create policy "Admins manage announcements" on public.announcements 
  for all using ( (select role from public.users where id = auth.uid()) = 'ADMIN' );
create policy "Everyone reads active announcements" on public.announcements 
  for select using ( active = true );
