-- Native waitlist funnel (API inserts via service role only)
create table public.waitlist_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  email text not null unique,
  source text,
  interest_type text
);

comment on table public.waitlist_subscribers is 'Waitlist subscribers; inserts from Next.js API route using service role.';

alter table public.waitlist_subscribers enable row level security;

-- No policies: authenticated/anon clients cannot SELECT/INSERT. Service role bypasses RLS.
