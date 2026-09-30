-- Applied to production Supabase project lnywzxvdbcissygxxwun on 2026-09-30.
alter table public.matches
  add column if not exists timer_started_at timestamptz;

comment on column public.matches.timer is
  'Seconds remaining at the last timer transition. While active, clients subtract elapsed time since timer_started_at.';

comment on column public.matches.timer_started_at is
  'Server-written timestamp anchoring the active countdown. Null when paused/lobby/finished.';
