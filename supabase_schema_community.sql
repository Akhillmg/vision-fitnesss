-- View for Volume Leaderboard (All time)
create or replace view view_leaderboard_volume as
select 
  u.id as user_id,
  u.full_name,
  coalesce(sum(wl.volume_kg), 0) as total_volume_kg,
  count(wl.id) as workouts_completed
from users u
left join workout_logs wl on u.id = wl.user_id
group by u.id, u.full_name
order by total_volume_kg desc;

-- View for Recent Activity Feed
create or replace view view_community_feed as
select
  wl.id as log_id,
  wl.user_id,
  u.full_name,
  wl.name as workout_name,
  wl.created_at,
  wl.volume_kg
from workout_logs wl
join users u on wl.user_id = u.id
where wl.ended_at is not null
order by wl.ended_at desc
limit 50;
