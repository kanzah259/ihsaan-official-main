-- Run once in Supabase SQL Editor after the original tracker migration.
-- Tracker access is assigned explicitly in tracker_members; only admins can manage it.

create or replace function public.current_tracker_role()
returns public.tracker_member_role
language sql
stable
security definer
set search_path = public
as $$
  select member.role
  from public.tracker_members member
  where member.email = lower(coalesce(auth.jwt() ->> 'email', ''))
    and member.active = true
  limit 1;
$$;

grant select, insert, update, delete on public.tracker_members to authenticated;
grant select, insert, update on public.tracker_members to service_role;

drop policy if exists "Admins can view tracker members" on public.tracker_members;
drop policy if exists "Admins can add tracker members" on public.tracker_members;
drop policy if exists "Admins can update tracker members" on public.tracker_members;
drop policy if exists "Admins can delete tracker members" on public.tracker_members;

create policy "Admins can view tracker members"
on public.tracker_members for select
to authenticated
using (public.current_tracker_role() = 'admin');

create policy "Admins can add tracker members"
on public.tracker_members for insert
to authenticated
with check (
  public.current_tracker_role() = 'admin'
  and email like '%@fosis.org.uk'
);

create policy "Admins can update tracker members"
on public.tracker_members for update
to authenticated
using (public.current_tracker_role() = 'admin')
with check (
  public.current_tracker_role() = 'admin'
  and email like '%@fosis.org.uk'
);

create policy "Admins can delete tracker members"
on public.tracker_members for delete
to authenticated
using (public.current_tracker_role() = 'admin');
