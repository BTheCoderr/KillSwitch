-- Track the live sponsor_leads schema and keep the route server-write-only.
create table if not exists public.sponsor_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  company_name text,
  contact_name text,
  email text not null,
  budget_range text,
  message text,
  source text
);

alter table public.sponsor_leads
  add column if not exists company_name text,
  add column if not exists contact_name text,
  add column if not exists email text,
  add column if not exists budget_range text,
  add column if not exists message text,
  add column if not exists source text;

alter table public.sponsor_leads enable row level security;

revoke all on table public.sponsor_leads from anon, authenticated;

comment on table public.sponsor_leads is
  'Sponsor deck requests inserted only by the server using the service role.';
