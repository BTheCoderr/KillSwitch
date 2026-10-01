-- Applied to production Supabase project lnywzxvdbcissygxxwun on 2026-09-30.
-- Legacy intake tables are optional on a fresh install, so guard policy work with to_regclass.

drop policy if exists "deny public applications" on public.applications;
drop policy if exists "deny public waitlist" on public.waitlist_subscribers;

create policy "deny public applications"
  on public.applications for all to anon, authenticated
  using (false) with check (false);

create policy "deny public waitlist"
  on public.waitlist_subscribers for all to anon, authenticated
  using (false) with check (false);

do $$
begin
  if to_regclass('public.competitor_applications') is not null then
    execute 'drop policy if exists "deny public competitor applications" on public.competitor_applications';
    execute 'create policy "deny public competitor applications"
      on public.competitor_applications for all to anon, authenticated
      using (false) with check (false)';
  end if;

  if to_regclass('public.sponsor_leads') is not null then
    execute 'drop policy if exists "deny public sponsor leads" on public.sponsor_leads';
    execute 'create policy "deny public sponsor leads"
      on public.sponsor_leads for all to anon, authenticated
      using (false) with check (false)';
  end if;
end
$$;
