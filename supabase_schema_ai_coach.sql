-- Create table for storing AI generated plans
create table if not exists ai_generated_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  user_input jsonb not null, -- Stores weight, goal, preferences
  plan_data jsonb not null, -- Stores the generated workout/diet plan
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table ai_generated_plans enable row level security;

create policy "Users can view their own AI plans"
  on ai_generated_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own AI plans"
  on ai_generated_plans for insert
  with check (auth.uid() = user_id);
