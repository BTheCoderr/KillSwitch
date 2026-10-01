-- Real sponsor intake for the Season Zero site.
create table if not exists public.sponsor_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text not null,
  source text not null default 'web'
);

alter table public.sponsor_leads enable row level security;

revoke all on table public.sponsor_leads from anon, authenticated;

comment on table public.sponsor_leads is
  'Sponsor deck requests inserted only by the server using the service role.';
