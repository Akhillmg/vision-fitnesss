-- Trainer-Client Assignments
create table public.trainer_assignments (
  id uuid default gen_random_uuid() primary key,
  trainer_id uuid references public.users(id) not null,
  client_id uuid references public.users(id) not null,
  assigned_at timestamp with time zone default now(),
  unique(trainer_id, client_id)
);

-- Workout Plans (Header)
create table public.workout_plans (
  id uuid default gen_random_uuid() primary key,
  trainer_id uuid references public.users(id) not null,
  name text not null,
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Assign Plans to Clients (Many-to-Many or One-to-Many? Usually a client follows one plan at a time, or multiple. Let's do assignments table)
create table public.client_plans (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references public.workout_plans(id) not null,
  client_id uuid references public.users(id) not null,
  assigned_at timestamp with time zone default now(),
  active boolean default true
);

-- Trainer Notes on Clients
create table public.trainer_notes (
  id uuid default gen_random_uuid() primary key,
  trainer_id uuid references public.users(id) not null,
  client_id uuid references public.users(id) not null,
  note text not null,
  created_at timestamp with time zone default now()
);

-- RLS Policies

-- Assignments: 
-- Trainers can view their own assignments. 
-- Admins view all. 
-- Clients view successful assignments (who is my trainer?).
alter table public.trainer_assignments enable row level security;
create policy "Trainers view own assignments" on public.trainer_assignments 
  for select using ( auth.uid() = trainer_id );
create policy "Admins view all assignments" on public.trainer_assignments 
  for all using ( (select role from public.users where id = auth.uid()) = 'ADMIN' );
create policy "Clients view own trainer" on public.trainer_assignments 
  for select using ( auth.uid() = client_id );

-- Workout Plans:
-- Trainers full access to own plans.
alter table public.workout_plans enable row level security;
create policy "Trainers access own plans" on public.workout_plans 
  for all using ( auth.uid() = trainer_id );
-- Clients read plans assigned to them (via client_plans join? or simple check).
-- Simpler: If a plan is in client_plans for me, I can read it.
create policy "Clients read assigned plans" on public.workout_plans 
  for select using ( 
    exists (select 1 from public.client_plans where plan_id = public.workout_plans.id and client_id = auth.uid())
  );

-- Client Plans Link
alter table public.client_plans enable row level security;
-- Trainer can manage assignments for their plans OR their clients.
create policy "Trainers manage plan assignments" on public.client_plans 
  for all using ( 
    exists (select 1 from public.workout_plans where id = plan_id and trainer_id = auth.uid())
    OR 
    exists (select 1 from public.trainer_assignments where client_id = public.client_plans.client_id and trainer_id = auth.uid())
  );
create policy "Clients read own plan assignments" on public.client_plans 
  for select using ( auth.uid() = client_id );

-- Notes
alter table public.trainer_notes enable row level security;
create policy "Trainers manage own notes" on public.trainer_notes 
  for all using ( auth.uid() = trainer_id );
-- Clients DO NOT see these notes (private).
