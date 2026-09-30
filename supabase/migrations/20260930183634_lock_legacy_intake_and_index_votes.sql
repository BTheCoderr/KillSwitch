-- Applied to production Supabase project lnywzxvdbcissygxxwun on 2026-09-30.
alter table public.competitor_applications enable row level security;
alter table public.sponsor_leads enable row level security;

revoke all on table public.competitor_applications from anon, authenticated;
revoke all on table public.sponsor_leads from anon, authenticated;

create index if not exists votes_match_id_idx on public.votes(match_id);
