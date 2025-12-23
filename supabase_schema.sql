-- Create a table for public user profiles
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  role text check (role in ('ADMIN', 'TRAINER', 'MEMBER')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on public.users for select
  using ( true );

create policy "Users can insert their own profile."
  on public.users for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.users for update
  using ( auth.uid() = id );

-- Create a table for Gym Configuration (Codes)
create table public.gym_config (
  id uuid default gen_random_uuid() primary key,
  admin_code text not null,
  trainer_code text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Gym Config
alter table public.gym_config enable row level security;

-- No public access policies for gym_config. Access via RPC only.

-- Insert default codes
insert into public.gym_config (admin_code, trainer_code)
values ('VISION-ADMIN', 'VISION-TRAINER');

-- Function to verify code securely
create or replace function verify_role_code(role_type text, input_code text)
returns boolean
language plpgsql
security definer
as $$
declare
  valid_code text;
begin
  if role_type = 'ADMIN' then
    select admin_code into valid_code from public.gym_config limit 1;
  elsif role_type = 'TRAINER' then
    select trainer_code into valid_code from public.gym_config limit 1;
  else
    return false;
  end if;

  return valid_code = input_code;
end;
$$;

-- Function to update admin password (code)
create or replace function update_admin_code(new_code text)
returns boolean
language plpgsql
security definer
as $$
declare
  current_user_role text;
begin
  -- Check if the user is an ADMIN
  select role into current_user_role from public.users where id = auth.uid();
  
  if current_user_role = 'ADMIN' then
    update public.gym_config set admin_code = new_code;
    return true;
  else
    return false; 
  end if;
end;
$$;

-- Update default admin code
update public.gym_config set admin_code = 'akhilmg@2006';

-- Function for admin to update trainer code
create or replace function update_trainer_code(new_code text)
returns boolean
language plpgsql
security definer
as d:\vision fitness
declare
  current_user_role text;
begin
  -- Check if the user is an ADMIN
  select role into current_user_role from public.users where id = auth.uid();
  
  if current_user_role = 'ADMIN' then
    update public.gym_config set trainer_code = new_code;
    return true;
  else
    return false; 
  end if;
end;
d:\vision fitness;

-- Function to get trainer code (Admin Only)
create or replace function get_trainer_code()
returns text
language plpgsql
security definer
as d:\vision fitness
declare
  current_user_role text;
  code text;
begin
  select role into current_user_role from public.users where id = auth.uid();
  
  if current_user_role = 'ADMIN' then
    select trainer_code into code from public.gym_config limit 1;
    return code;
  else
    return null;
  end if;
end;
d:\vision fitness;


-- Add status column to users if it doesn't exist
alter table public.users add column if not exists status text default 'active' check (status in ('active', 'disabled', 'pending'));

-- Function for Admin to manage users (Enable/Disable/Reset)
create or replace function admin_manage_user(target_user_id uuid, action_type text)
returns boolean
language plpgsql
security definer
as d:\vision fitness
declare
  current_user_role text;
begin
  -- Check if executor is ADMIN
  select role into current_user_role from public.users where id = auth.uid();
  if current_user_role != 'ADMIN' then
    return false;
  end if;

  if action_type = 'DISABLE' then
    update public.users set status = 'disabled' where id = target_user_id;
  elsif action_type = 'ENABLE' then
    update public.users set status = 'active' where id = target_user_id;
  elsif action_type = 'RESET_ROLE' then
    update public.users set role = null where id = target_user_id;
  end if;

  return true;
end;
d:\vision fitness;

