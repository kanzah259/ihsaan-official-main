-- Run this once if the original tracker migration has already been run.
-- Verified @fosis.org.uk users can submit opportunities as members.
-- Individual entries in tracker_members can still grant editor/admin access.

create or replace function public.current_tracker_role()
returns public.tracker_member_role
language sql
stable
security definer
set search_path = public
as $$
  with current_email as (
    select lower(coalesce(auth.jwt() ->> 'email', '')) as email
  )
  select coalesce(
    (
      select member.role
      from public.tracker_members member
      join current_email on current_email.email = member.email
      where member.active = true
      limit 1
    ),
    case
      when (select email from current_email) like '%@fosis.org.uk'
      then 'member'::public.tracker_member_role
    end
  );
$$;

grant execute on function public.current_tracker_role() to authenticated;
