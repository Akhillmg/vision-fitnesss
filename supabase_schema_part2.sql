-- Memberships plans
create table public.memberships (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price numeric not null,
  duration_months int not null,
  created_at timestamp with time zone default now()
);

-- User Memberships (link user to plan)
create table public.user_memberships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  membership_id uuid references public.memberships(id),
  start_date date default CURRENT_DATE,
  end_date date not null,
  status text default 'active',
  created_at timestamp with time zone default now()
);

-- Payments
create table public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  amount numeric not null,
  status text default 'pending',
  due_date date not null,
  created_at timestamp with time zone default now()
);

-- Attendance
create table public.attendance (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  check_in_time timestamp with time zone default now()
);

-- Enable RLS
alter table public.memberships enable row level security;
alter table public.user_memberships enable row level security;
alter table public.payments enable row level security;
alter table public.attendance enable row level security;

-- Policies (Simplified for MVP, ideally Admin full, Users read-own)
create policy "Admins all access memberships" on public.memberships for all using ( (select role from public.users where id = auth.uid()) = 'ADMIN' );
create policy "Public read memberships" on public.memberships for select using ( true );

create policy "Admins all access user_memberships" on public.user_memberships for all using ( (select role from public.users where id = auth.uid()) = 'ADMIN' );
create policy "Users read own memberships" on public.user_memberships for select using ( auth.uid() = user_id );

create policy "Admins all access payments" on public.payments for all using ( (select role from public.users where id = auth.uid()) = 'ADMIN' );
create policy "Users read own payments" on public.payments for select using ( auth.uid() = user_id );

create policy "Admins all access attendance" on public.attendance for all using ( (select role from public.users where id = auth.uid()) = 'ADMIN' );
create policy "Users insert own attendance" on public.attendance for insert with check ( auth.uid() = user_id );
create policy "Users read own attendance" on public.attendance for select using ( auth.uid() = user_id );
