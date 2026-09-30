-- Applied to production Supabase project lnywzxvdbcissygxxwun on 2026-09-30.
alter table public.matches enable row level security;
alter table public.players enable row level security;
alter table public.votes enable row level security;
alter table public.applications enable row level security;
alter table public.waitlist_subscribers enable row level security;

drop policy if exists "allow all on matches" on public.matches;
drop policy if exists "allow all on players" on public.players;
drop policy if exists "allow all on votes" on public.votes;
drop policy if exists "anon insert applications" on public.applications;

drop policy if exists "public read matches" on public.matches;
drop policy if exists "public read players" on public.players;
drop policy if exists "public read votes" on public.votes;
drop policy if exists "public cast valid votes" on public.votes;

revoke all on table public.matches from anon, authenticated;
revoke all on table public.players from anon, authenticated;
revoke all on table public.votes from anon, authenticated;
revoke all on table public.applications from anon, authenticated;
revoke all on table public.waitlist_subscribers from anon, authenticated;

grant select on table public.matches to anon, authenticated;
grant select on table public.players to anon, authenticated;
grant select on table public.votes to anon, authenticated;
grant insert on table public.votes to anon, authenticated;

create policy "public read matches"
  on public.matches for select to anon, authenticated
  using (true);

create policy "public read players"
  on public.players for select to anon, authenticated
  using (true);

create policy "public read votes"
  on public.votes for select to anon, authenticated
  using (true);

create policy "public cast valid votes"
  on public.votes for insert to anon, authenticated
  with check (
    command in (
      'reverse-iteration',
      'time-crunch',
      'memory-limit',
      'bright-pink',
      'no-backspace',
      'darkmode'
    )
    and exists (
      select 1
      from public.matches m
      where m.id = match_id
        and m.status in ('lobby', 'active')
    )
  );
