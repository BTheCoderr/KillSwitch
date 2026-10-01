-- Production-readiness hardening: votes are producer-ingested and score writes are atomic.
-- Public clients retain read-only access for overlays and spectators.

revoke insert on table public.votes from anon, authenticated;
drop policy if exists "public cast valid votes" on public.votes;

create or replace function public.increment_player_score(
  p_player_id uuid,
  p_delta integer
)
returns setof public.players
language sql
security invoker
set search_path = ''
as $$
  update public.players
  set score = greatest(
    0,
    coalesce(public.players.score, 0) + greatest(-100, least(100, p_delta))
  )
  where public.players.id = p_player_id
  returning public.players.*;
$$;

revoke all on function public.increment_player_score(uuid, integer) from public;
revoke all on function public.increment_player_score(uuid, integer) from anon, authenticated;
grant execute on function public.increment_player_score(uuid, integer) to service_role;
