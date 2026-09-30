-- KILLSWITCH authoritative timer upgrade
-- REVIEW + APPLY to the connected Supabase project before enabling the new timer flow.
--
-- Kept outside supabase/migrations until the correct live project is connected.
-- Generate a real migration with the Supabase CLI first, then copy this SQL into it.

begin;

alter table public.matches
  add column if not exists timer_started_at timestamptz;

comment on column public.matches.timer is
  'Seconds remaining at the last timer transition. While active, clients subtract elapsed time since timer_started_at.';

comment on column public.matches.timer_started_at is
  'Server-written timestamp anchoring the active countdown. Null when paused/lobby/finished.';

commit;
