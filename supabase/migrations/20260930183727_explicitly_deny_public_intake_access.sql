-- Applied to production Supabase project lnywzxvdbcissygxxwun on 2026-09-30.
drop policy if exists "deny public applications" on public.applications;
drop policy if exists "deny public waitlist" on public.waitlist_subscribers;
drop policy if exists "deny public competitor applications" on public.competitor_applications;
drop policy if exists "deny public sponsor leads" on public.sponsor_leads;

create policy "deny public applications"
  on public.applications for all to anon, authenticated
  using (false) with check (false);

create policy "deny public waitlist"
  on public.waitlist_subscribers for all to anon, authenticated
  using (false) with check (false);

create policy "deny public competitor applications"
  on public.competitor_applications for all to anon, authenticated
  using (false) with check (false);

create policy "deny public sponsor leads"
  on public.sponsor_leads for all to anon, authenticated
  using (false) with check (false);
